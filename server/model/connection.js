import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freshdesk: {
    domain: String,
    apiKey: String,
  },
  hubspot: {
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
  },
}, { timestamps: true });

const ExternalConnection = mongoose.model('ExternalConnection', connectionSchema);
export default  ExternalConnection