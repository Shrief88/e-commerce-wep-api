import mongoose, { Schema } from "mongoose";

export interface IBrand extends mongoose.Document {
  name: string;
  slug: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 2,
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

export default mongoose.model<IBrand>("Brand", brandSchema);
