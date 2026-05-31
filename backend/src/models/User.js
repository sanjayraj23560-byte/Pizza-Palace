import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  membership: { type: String, default: "none" }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);