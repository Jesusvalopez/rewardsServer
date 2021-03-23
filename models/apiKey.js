import mongoose from "mongoose";

const apiKeySchema = mongoose.Schema({
  userId: { type: String, required: true },
  apiKey: { type: String, required: true },
  apiSecret: { type: String, required: true },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
