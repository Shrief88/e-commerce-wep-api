import mongoose from "mongoose";

import { type Address } from "./user";

enum PaymentMethods {
  CARD = "card",
  Cash = "cash",
}

export interface IOrder extends mongoose.Document {
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
  user: mongoose.Schema.Types.ObjectId;
  taxPrice: number;
  shippingPrice: number;
  paymentMethod: PaymentMethods;
  shippingAddress: Address;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      required: true,
      type: String,
      enum: Object.values(PaymentMethods),
      default: PaymentMethods.Cash,
    },
    shippingAddress: {
      details: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      postcode: { type: String, required: true },
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = mongoose.model<IOrder>("Order", orderSchema);
