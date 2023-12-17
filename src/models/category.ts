import mongoose, { Schema } from "mongoose";
import env from "../config/validateEnv";

export interface ICategory extends mongoose.Document {
  name: string;
  slug: string;
  image: string;
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
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.post("init", function (doc) {
  if (doc.image) {
    const imageUrl = `${env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
  }
});

categorySchema.post("save", function (doc) {
  if (doc.image) {
    const imageUrl = `${env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
  }
});

export default mongoose.model<ICategory>("Category", categorySchema);
