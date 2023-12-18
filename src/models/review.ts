import mongoose, { Schema } from "mongoose";

export interface IReview extends mongoose.Document {
  title: string;
  rating: number;
  user: string;
  product: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema(
  {
    title: {
      type: String,
      minLength: 20,
      trim: true,
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

export default mongoose.model<IReview>("Review", categorySchema);
