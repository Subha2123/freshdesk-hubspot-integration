


const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;



export const connectHubSpot = async (req, res) => {
  try {
    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=crm.objects.contacts.read&response_type=code`;

    return res.redirect(authUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error redirecting to HubSpot");
  }
};

export const hubspotCallback = async (req, res) => {
  try {
    const code = req.query.code;

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
      userId: req.user.userId,
    });

    if (!connection) {
      connection = new ExternalConnection({
        userId: req.user.userId,
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

    res.send("✅ HubSpot connected successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting HubSpot");
  }
};
