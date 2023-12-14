import mongoose, { Schema } from "mongoose";

export interface ICategory extends mongoose.Document {
  name: string;
  slug: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 32,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ICategory>("Category", categorySchema);
