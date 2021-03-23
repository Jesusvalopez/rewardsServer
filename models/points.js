import mongoose from "mongoose";

const pointsSchema = mongoose.Schema({
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

const Points = mongoose.model("Points", pointsSchema);

export default Points;
