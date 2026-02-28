import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: false, default: "" },
    category: { type: String, required: true, default: "General" },
  },
  { timestamps: true },
);

export default mongoose.models.Note ||
  mongoose.model<INote>("Note", NoteSchema);
