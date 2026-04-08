import ExternalConnection from "../model/connection.js";


export const connectFreshDesk = async (req, res) => {
    try {
        const { domain, apiKey } = req.body;
        if (!domain || !apiKey) {
            return res.status(400).json({ message: 'Domain and API key required' });
        }
        const response = await fetch(`https://${domain}.freshdesk.com/api/v2/tickets`, {
            headers: {
                Authorization: `Basic ${Buffer.from(apiKey + ':X').toString('base64')}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            return res.status(400).json({ message: 'Invalid domain or API key' });
        }

        let connection = await ExternalConnection.findOne({ userId: req.user.userId });
        if (!connection) {
            connection = new ExternalConnection({ userId: req.user.userId });
        }
        connection.freshdesk = { domain, apiKey };
        await connection.save();
        res.json({ message: 'Freshdesk connected successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error connecting Freshdesk' });
    }
}


export const fetchTickets = async (req, res) => {
  try {
    const userId = req.user.userId;

    const connection = await ExternalConnection.findOne({ userId });

    if (!connection?.freshdesk) {
      return res.status(400).json({ message: "Freshdesk not connected" });
    }

    const { domain, apiKey } = connection.freshdesk;

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/tickets`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey + ':X').toString('base64')}`,
        },
      }
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};


export const getTicketConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { ticketId } = req.params;

    const connection = await ExternalConnection.findOne({ userId });

    if (!connection?.freshdesk) {
      return res.status(400).json({ message: "Freshdesk not connected" });
    }

    const { domain, apiKey } = connection.freshdesk;

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/tickets/${ticketId}/conversations`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey + ':X').toString('base64')}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ message: "Failed to fetch conversations" });
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching conversations" });
  }
};

