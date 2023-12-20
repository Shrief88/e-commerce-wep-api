import mongoose, { Schema } from "mongoose";

import returnImageUrl from "../utils/returnImageUrl";

export interface IBrand extends mongoose.Document {
  name: string;
  slug: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
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
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Schema Middlewares
brandSchema.post("init", function (doc) {
  returnImageUrl<IBrand>(doc, "brand");
});

brandSchema.post("save", function (doc) {
  returnImageUrl<IBrand>(doc, "brand");
});

export const BrandModel = mongoose.model<IBrand>("Brand", brandSchema);
