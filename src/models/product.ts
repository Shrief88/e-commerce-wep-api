import mongoose, { Schema } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  sold: number;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  colors?: string[];
  imageCover: string;
  images?: string[];
  category: string;
  subcategory?: string[];
  brand: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema(
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
    description: {
      type: String,
      required: true,
      minLength: 20,
      maxLength: 500,
      trim: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      required: true,
    },
    ratingsAverage: {
      type: Number,
      min: 1,
      max: 5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IProduct>("Product", productSchema);
