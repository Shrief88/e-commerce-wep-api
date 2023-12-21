import mongoose, { Schema } from "mongoose";

import { ProductModel } from "./product";

export interface IReview extends mongoose.Document {
  title?: string;
  rating: number;
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewMethods extends mongoose.Model<IReview> {
  calcAverageRatingAndQuality: (
    productId: Schema.Types.ObjectId,
  ) => Promise<any>;
}

const reviewSchema = new Schema<IReview, ReviewMethods>(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.static(
  "calcAverageRatingAndQuality",
  async function calcAverageRatingAndQuality(productId: string) {
    const result: any[] = await this.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: "product",
          avgRatings: { $avg: "$rating" },
          ratingsQuantity: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      await ProductModel.findByIdAndUpdate(productId, {
        ratingsQuantity: result[0].ratingsQuantity,
        ratingsAverage: result[0].avgRatings,
      });
    }
  },
);

// Middleware to get all reviews of a product
reviewSchema.pre<IReview>(/^find/, function (next) {
  void this.populate({
    path: "user",
    select: "name",
  });
  next();
});

reviewSchema.post<IReview>("save", async function () {
  const Review = this.constructor as ReviewMethods;
  await Review.calcAverageRatingAndQuality(this.product);
});

export const ReviewModel = mongoose.model<IReview, ReviewMethods>(
  "Review",
  reviewSchema,
);
