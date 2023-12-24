import { type RequestHandler } from "express";
import createHttpError from "http-errors";
import Stripe from "stripe";

import { type IOrder, OrderModel } from "../models/order";
import { CartModel } from "../models/cart";
import { ProductModel } from "../models/product";
import { type CustomRequest } from "./auth";
import env from "../config/validateEnv";

export const createCashOrder: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    // We will assume that values of shippingPrice and taxPrice are 0
    const shippingPrice = 0;
    const taxPrice = 0;

    const cart = await CartModel.findById(req.params.cartId);
    if (!cart) {
      throw createHttpError(404, "Cart not found");
    }

    const price = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalPrice;

    const order = await OrderModel.create({
      user: req.user._id,
      cartItems: cart.cartItems,
      totalPrice: price + shippingPrice + taxPrice,
      shippingAddress: req.body.shippingAddress,
    });

    if (order) {
      const bulkOption = cart.cartItems.map((item) => {
        return {
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: { quantity: -item.quantity, sold: +item.quantity },
            },
          },
        };
      });
      await ProductModel.bulkWrite(bulkOption, {});
    }
    await CartModel.findByIdAndDelete(req.params.cartId);
    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
};

export const getOrders: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    let orders: IOrder[] = [];
    if (req.user.role === "admin" || req.user.role === "manager") {
      orders = await OrderModel.find();
    } else if (req.user.role === "user") {
      orders = await OrderModel.find({ user: req.user._id });
    }
    res.status(200).json({ data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrder: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      throw createHttpError(404, "Order not found");
    }
    res.status(200).json({ data: order });
  } catch (err) {
    next(err);
  }
};

export const updatePaidStatus: RequestHandler = async (req, res, next) => {
  try {
    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      {
        isPaid: true,
        paidAt: Date.now(),
      },
      { new: true },
    );

    if (!order) {
      throw createHttpError(404, "Order not found");
    }
    res.status(200).json({ data: order });
  } catch (err) {
    next(err);
  }
};

export const updateDeliveredStatus: RequestHandler = async (req, res, next) => {
  try {
    const order = await OrderModel.findByIdAndUpdate(req.params.id, {
      isDelivered: true,
      deliveredAt: Date.now(),
    });
    if (!order) {
      throw createHttpError(404, "Order not found");
    }
    res.status(200).json({ data: order });
  } catch (err) {
    next(err);
  }
};

// @desc get checkout session from stripe and send it as response
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
export const checkoutSession: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    // We will assume that values of shippingPrice and taxPrice are 0
    const shippingPrice = 0;
    const taxPrice = 0;

    const cart = await CartModel.findById(req.params.cartId);
    if (!cart) {
      throw createHttpError(404, "Cart not found");
    }

    const price = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalPrice;

    const lineItems = [
      {
        price_data: {
          currency: "egp",
          unit_amount: (price + shippingPrice + taxPrice) * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ];
    const seesion = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/cart`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
      metadata: req.body.shippingAddress,
    });

    res.status(200).json({ data: seesion });
  } catch (err) {
    next(err);
  }
};
