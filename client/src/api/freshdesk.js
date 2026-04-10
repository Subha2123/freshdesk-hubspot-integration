
import { apiRequest } from ".";


export const connectFreshdesk = async (form) => {
  try {
    return await apiRequest("/connect/freshdesk", {
      method: "POST",
      body: JSON.stringify(form),
    });
  } catch (error) {
    console.error("connectFreshdesk Error:", error.message);
    return { success: false };
  }
};


export const fetchTickets = async () => {
  try {
    return await apiRequest("/connect/tickets/");
  } catch (error) {
    console.error("fetchTickets Error:", error.message);
    return { success: false, data: [] };
  }
};


export const fetchConversations = async (ticketId) => {
  try {
    return await apiRequest(`/connect/tickets/conversations/${ticketId}`);
  } catch (error) {
    console.error("fetchConversations Error:", error.message);
    return { success: false, data: [] };
  }
};


export const fetchWebHookLogs = async () => {
  try {
    return await apiRequest("/webhook-logs");
  } catch (error) {
    console.error("fetchWebHookLogs Error:", error.message);
    return { success: false, data: [] };
  }
};


export const connectHubSpot = async () => {
  try {
    return await apiRequest("/connect/hubspot");
  } catch (error) {
    console.error("Connect HubSpot Error:", error.message);
    return { success: false, data: [] };
  }
};


export const getContactsCRM = async (email) => {
  try {
    return await apiRequest(`/connect/hubspot/contacts?email=${email}`);
  } catch (error) {
    console.error("Connect HubSpot Error:", error.message);
    return { success: false, data: [] };
  }
};


export const getHubspotConnectMetaData = async () => {
  try {
    return await apiRequest(`/connect/hubspot/metadata`);
  } catch (error) {
    console.error("Connect HubSpot Error:", error.message);
    return { success: false, data: [] };
  }
};

