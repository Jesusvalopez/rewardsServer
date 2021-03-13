import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  provider: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  profilePictureUrl: String,
  points: Number,
});

const User = mongoose.model("User", userSchema);

export default User;
