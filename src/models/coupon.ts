import mongoose from "mongoose";

interface ICoupon extends mongoose.Document {
  name: string;
  expire: Date;
  discount: number;
}

const couponSchema = new mongoose.Schema<ICoupon>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    expire: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CouponModel = mongoose.model<ICoupon>("Coupon", couponSchema);
