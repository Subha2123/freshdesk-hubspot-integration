
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
