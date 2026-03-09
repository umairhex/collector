import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  username: string;
  passwordHash: string;
  sessionToken: string;
  aiModel?: string;
}

const SettingsSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    sessionToken: { type: String, required: true },
    aiModel: { type: String, default: "google/gemini-2.0-flash-100k" },
  },
  { timestamps: true },
);

export default mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);
