
import ExternalConnection from "../model/connection.js";
import dotenv from 'dotenv'

dotenv.config()

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HUBSPOT_CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;




export const connectHubSpot = async (req, res) => {
  try {
    const state = encodeURIComponent(JSON.stringify({ userId: req.user.userId }));
    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=crm.objects.contacts.write+oauth+crm.objects.contacts.read&state=${state}`;
    return res.json({ authUrl })
  } catch (error) {
    console.error(error);
    res.status(500).send("Error redirecting to HubSpot");
  }
}

export const hubspotCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const state = JSON.parse(decodeURIComponent(req.query.state));
    if (!code) {
      return res.status(400).send("No code provided");
    }

    const response = await fetch("https://api.hubapi.com/oauth/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("HubSpot error:", data);
      return res.status(400).json(data);
    }


    let connection = await ExternalConnection.findOne({
      userId: state.userId,
    });

    if (!connection) {
      connection = new ExternalConnection({
        userId: state.userId,
      });
    }

    connection.hubspot = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope,
      hubId: data.hub_id,
    };

    await connection.save();
    res.redirect("http://localhost:5173/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting HubSpot");
  }
};


const getHubSpotToken = async (userId) => {
  try {
    const connection = await ExternalConnection.findOne({ userId });
    if (!connection?.hubspot) {
      return res.status(400).json({ error: "HubSpot not connected" });
    }
    let { accessToken, refreshToken } = connection.hubspot;
    return { accessToken, refreshToken }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting HubSpot");
  }
}


const refreshHubspotToken = async (refreshToken) => {
  const HUBSPOT_TOKEN_URL = "https://api.hubapi.com/oauth/v1/token";
  const body = new URLSearchParams({ grant_type: "refresh_token", client_id: HUBSPOT_CLIENT_ID, client_secret: HUBSPOT_CLIENT_SECRET, refresh_token: refreshToken, });
  const res = await fetch(HUBSPOT_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to refresh HubSpot token", res);
  }

  return data;
};


export const hubspotFetch = async (userId, url, options = {}) => {
  let { accessToken, refreshToken } = await getHubSpotToken(userId);

  const makeRequest = async (token) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return { res, data };
  };


  let { res, data } = await makeRequest(accessToken);

  if (!res.ok && data?.category === "EXPIRED_AUTHENTICATION") {
    console.log("🔄 Refreshing HubSpot token...");

    const newToken = await refreshHubspotToken(refreshToken);
    await ExternalConnection.updateOne(
      { userId },
      {
        "hubspot.accessToken": newToken.access_token,
        "hubspot.refreshToken":
          newToken.refresh_token || refreshToken,
      }
    );
    ({ res, data } = await makeRequest(newToken.access_token));
  }

  return { res, data };
};


export const getHubSpotContacts = async (req, res) => {
  try {
    const { email } = req.query;
    const userId = req.user.userId;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { res: response, data } = await hubspotFetch(
      userId,
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: email,
                },
              ],
            },
          ],
          properties: [
            "firstname",
            "lastname",
            "email",
            "lifecyclestage",
            "phone",
            "company",
          ],
          limit: 1,
        }),
      }
    );

    if (!response.ok) {
      return res.status(400).json({ error: data });
    }

    if (data.results?.length > 0) {
      const contact = data.results[0].properties;

      return res.status(200).json({
        name: `${contact.firstname || ""} ${contact.lastname || ""}`.trim(),
        email: contact.email,
        lifecycleStage: contact.lifecyclestage,
        phone: contact.phone,
        company: contact.company || null,
      });
    }

    return res.status(200).json({
      message: "No contact found",
    });

  } catch (error) {
    console.error("HubSpot error:", error);
    return res.status(500).json({
      error: "Error fetching contact from HubSpot",
    });
  }
};

export const getHubspotConnectMetaData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [accountRes, contactsRes] = await Promise.all([
      hubspotFetch(
        userId,
        "https://api.hubapi.com/account-info/v3/details"
      ),

      hubspotFetch(
        userId,
        "https://api.hubapi.com/crm/v3/objects/contacts/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: 5,
            properties: ["firstname", "lastname", "email"],
          }),
        }
      ),
    ]);

    if (!accountRes.res.ok) {
      return res.status(400).json({ error: accountRes.data });
    }


    const contacts =
      contactsRes.data?.results?.map((c) => ({
        id: c.id,
        name: `${c.properties.firstname || ""} ${c.properties.lastname || ""}`.trim(),
        email: c.properties.email,
      })) || [];


    const responseData = {
      account: {
        portalId: accountRes.data.portalId,
        plan: accountRes.data.accountType,
        region: accountRes.data.dataHostingLocation,
      },

      stats: {
        totalContacts: contactsRes.data?.total || 0,
      },

      contactsPreview:
        contactsRes.data?.results?.map((c) => ({
          id: c.id,
          name: `${c.properties.firstname || ""} ${c.properties.lastname || ""}`.trim(),
          email: c.properties.email,
        })) || [],
    };


    return res.status(200).json(responseData);

  } catch (error) {
    console.error("HubSpot error:", error);

    return res.status(500).json({
      error: "Error fetching CRM data",
    });
  }
};
