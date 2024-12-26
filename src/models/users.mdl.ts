import mongoose from "mongoose";

/**
 * USER SCHEMA
 */
const UserDbSchema = new mongoose.Schema({
  username: { type: String, requird: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserDbModel = mongoose.model("User", UserDbSchema);
