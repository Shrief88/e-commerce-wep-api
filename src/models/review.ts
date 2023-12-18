import mongoose, { Schema } from "mongoose";

export interface IReview extends mongoose.Document {
  title?: string;
  rating: number;
  user: string;
  product: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema(
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

// Middleware to get all reviews of a product
reviewSchema.pre<IReview>(/^find/, function (next) {
  void this.populate({
    path: "user",
    select: "name",
  });
  next();
});

export default mongoose.model<IReview>("Review", reviewSchema);
