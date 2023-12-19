import mongoose, { Schema } from "mongoose";

import returnImageUrl from "../utils/returnImageUrl";

export interface ICategory extends mongoose.Document {
  name: string;
  slug: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
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

// Schema Middlewares
categorySchema.post("init", function (doc) {
  returnImageUrl<ICategory>(doc, "category");
});

categorySchema.post("save", function (doc) {
  returnImageUrl<ICategory>(doc, "category");
});

export default mongoose.model<ICategory>("Category", categorySchema);
