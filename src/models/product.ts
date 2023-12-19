import mongoose, { Schema } from "mongoose";
import env from "../config/validateEnv";

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
  category: Schema.Types.ObjectId;
  subcategories?: Schema.Types.ObjectId[];
  brand: Schema.Types.ObjectId;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual Populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// A query middleware that populates the category and brand fields of the product when it is queried by /^find/
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

// Return image url in the response
const returnImageUrl = function (doc: mongoose.Document): void {
  const product = doc as IProduct;
  if (product.imageCover) {
    const imageUrl = `${env.BASE_URL}/product/${product.imageCover}`;
    product.imageCover = imageUrl;
  }
  if (product.images) {
    const images: string[] = [];
    product.images.forEach((image) => {
      const imageUrl = `${env.BASE_URL}/product/${image}`;
      images.push(imageUrl);
    });
    product.images = images;
  }
};

productSchema.post("init", function (doc) {
  returnImageUrl(doc);
});

productSchema.post("save", function (doc) {
  returnImageUrl(doc);
});

export default mongoose.model<IProduct>("Product", productSchema);
