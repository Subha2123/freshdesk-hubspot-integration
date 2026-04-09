import ExternalConnection from "../model/connection.js";
import webHookLogs from "../model/webhookLogs.js";


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
      `https://${domain}.freshdesk.com/api/v2/tickets?include=requester`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey + ':X').toString('base64')}`,
        },
      }
    );

    const data = await response?.json();

    const formattedData = (data || []).map(item => {
      return {
        id: item?.id || null,
        subject: item?.subject || '',
        requester_name: item?.requester?.name || '',
        requester_email: item?.requester?.email || '',
        subject: item?.subject || '',
        priority: item?.priority || '',
        status: item?.status || '',
        created_at: item?.created_at || '',
        due_by: item?.due_by || ''
      }
    })

    res.status(200).json(formattedData);
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
    // https://${domain}.freshdesk.com/api/v2/tickets/${ticketId}/conversations?include=ticket_id
    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/tickets/${ticketId}?include=conversations,requester`,
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

    const formattedData = {
      ticket: {
        id: data.id,
        type: data.type,
        due_by: data.due_by,
        is_escalated: data.is_escalated,
        description: data.description,
        created_at: data.created_at,
        subject: data.subject,
        requester_id: data.requester_id,
        requester_name: data.requester.name,
        requester_email: data.requester.email
      },
      conversations: [{
        body_text: data.description,
        created_at: data.created_at,
        conversation_type: "received"
      }, ...data.conversations && data.conversations.map(item => {
        return {
          body_text: item.body_text,
          created_at: item.created_at,
          incoming: item.incoming,
          private: item.private,
          user_id: item.user_id,
          ticket_id: item.ticket_id,
          created_at: item.created_at,
          conversation_type: item.user_id === data?.requester_id ? "received" : "sent"
        }
      })]
    }

    res.status(200).json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching conversations" });
  }
};


export const triggerTicket = async (req, res) => {
  try {
    const event_type=req.query?.type || ""
    console.log("🚀 ~ triggerTicket ~ event_type:", event_type)
    const payload = req.body;
    console.log("🚀 ~ triggerTicket ~ payload:", payload)
    const timestamp = new Date(payload.created_at || Date.now());
    const newLog = new webHookLogs({
      ticket_id: payload.ticket_id,
      event_type: event_type || "ticket_event",
      timestamp,
      payload: JSON.stringify(payload),
    });
    await newLog.save();

    res.status(200).json({
      message:"Webhook received",
      data:webHookLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing webhook");
  }
}