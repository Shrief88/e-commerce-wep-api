import mongoose, { Schema } from "mongoose";
import env from "../validators/validateEnv";

export interface IProduct extends mongoose.Document {
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
  subcategories?: string[];
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
      maxLength: 100,
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
      maxLength: 2000,
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
    subcategories: [
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

// Mongoose Query Middleware
productSchema.pre<IProduct>(/^find/, function (next) {
  void this.populate({
    path: "category",
    select: "name",
  });
  void this.populate({
    path: "brand",
    select: "name",
  });
  next();
});

productSchema.post("init", function (doc) {
  const imageUrl = `${env.BASE_URL}/product/${doc.imageCover}`;
  doc.imageCover = imageUrl;
  if (doc.images) {
    const images: string[] = [];
    doc.images.forEach((image) => {
      const imageUrl = `${env.BASE_URL}/product/${image}`;
      images.push(imageUrl);
    });
    doc.images = images;
  }
});

productSchema.post("save", function (doc) {
  const imageUrl = `${env.BASE_URL}/product/${doc.imageCover}`;
  doc.imageCover = imageUrl;
  if (doc.images) {
    const images: string[] = [];
    doc.images.forEach((image) => {
      const imageUrl = `${env.BASE_URL}/product/${image}`;
      images.push(imageUrl);
    });
    doc.images = images;
  }
});

export default mongoose.model<IProduct>("Product", productSchema);
