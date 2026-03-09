import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: string;
  shareable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Settings", required: true },
    title: { type: String, required: true },
    content: { type: String, required: false, default: "" },
    category: { type: String, required: true, default: "General" },
    shareable: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Note ||
  mongoose.model<INote>("Note", NoteSchema);
