import mongoose from "mongoose";

const wheelsSchema = mongoose.Schema({
  value: Number,
  user_id: String,
  description: String,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  expireDate: {
    type: Date,
  },
  isExpired: { type: Boolean, default: false },
});

const Wheels = mongoose.model("Wheels", wheelsSchema);

export default Wheels;
