import mongoose from "mongoose";

const webHookLogsSchema = new mongoose.Schema({
    ticket_id: String,
    event_type: {
        type: String,
        default: "ticket_event"
    },
    payload: {
        type:JSON
    },
}, { timestamps: true });

const webHookLogs = mongoose.model('WebhookLogs', webHookLogsSchema);
export default webHookLogs