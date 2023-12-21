import mongoose from "mongoose";

export interface ICart extends mongoose.Document {
  cartItems: [
    {
      _id?: string;
      product: mongoose.Schema.Types.ObjectId;
      quantity: number;
      color: string;
      price: number;
    },
  ];
  totalPrice: number;
  totalPriceAfterDiscount?: number;
  user: mongoose.Schema.Types.ObjectId;
}

const cartSchema = new mongoose.Schema<ICart>(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPriceAfterDiscount: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CartModel = mongoose.model<ICart>("Cart", cartSchema);
