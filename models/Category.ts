import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
}

const CategorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Settings", required: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
