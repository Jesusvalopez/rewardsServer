import crypto from "crypto";
import ApiKey from "../models/apiKey.js";

const apiKeyAuth = async (req, res, next) => {
  try {
    const API_KEY = req.headers["x-api-key"];
    const API_SECRET = req.headers["x-api-secret"];

    if (!API_KEY || !API_SECRET)
      return res.status(404).json({ message: "No autorizado" });

    const apiKey = await ApiKey.findOne({ apiKey: API_KEY });

    const DATABASE_KEY_SECRET = crypto
      .createHmac("sha1", API_KEY)
      .update(API_SECRET)
      .digest("hex");

    if (DATABASE_KEY_SECRET !== apiKey.apiSecret)
      return res.status(404).json({ message: "No autorizado" });

    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default apiKeyAuth;
