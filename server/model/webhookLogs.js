import mongoose from "mongoose";

const webHookLogsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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