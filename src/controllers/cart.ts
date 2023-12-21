/* eslint-disable @typescript-eslint/no-base-to-string */
import { type RequestHandler } from "express";
import createHttpError from "http-errors";

import { type CustomRequest } from "./auth";
import { CartModel, type ICart } from "../models/cart";
import { ProductModel } from "../models/product";
import { CouponModel } from "../models/coupon";

export const getLoggedUserCart: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const cart = await CartModel.findOne({
      user: req.user._id,
    });
    if (!cart) {
      throw createHttpError(404, "cart not found");
    }
    res.status(200).json({ data: cart });
  } catch (err) {
    next(err);
  }
};

const calulateTotalPrice = (cart: ICart): number => {
  const totalPrice = cart.cartItems.reduce((acc, item) => {
    acc += item.price * item.quantity;
    return acc;
  }, 0);
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

export const addToCart: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const { product, quantity, color } = req.body;
    const orderedProduct = await ProductModel.findById(product);
    if (!orderedProduct) {
      throw createHttpError(404, "product not found");
    }
    const price = orderedProduct.price;

    let userCart = await CartModel.findOne({
      user: req.user._id,
    });

    if (!userCart) {
      userCart = await CartModel.create({
        user: req.user._id,
        cartItems: [{ product, quantity, color, price }],
        totalPrice: price * quantity,
      });
      res.status(201).json({
        data: userCart,
      });
    } else {
      const productInCart = userCart.cartItems.findIndex((item) => {
        return item.product.toString() === product && item.color === color;
      });
      if (productInCart === -1) {
        userCart.cartItems.push({ product, quantity, color, price });
      } else {
        userCart.cartItems[productInCart].quantity += quantity;
      }
      userCart.totalPrice = calulateTotalPrice(userCart);
      await userCart.save();
      res.status(200).json({
        data: userCart,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const updateCart: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) {
      throw createHttpError(404, "Cart not found");
    }
    const index = cart.cartItems.findIndex((item) => {
      return item._id?.toString() === req.params.itemId;
    });
    if (index === -1) {
      throw createHttpError(404, "Item not found in cart");
    }
    cart.cartItems[index].quantity = req.body.quantity;
    cart.totalPrice = calulateTotalPrice(cart);
    await cart.save();
    res.status(200).json({ data: cart });
  } catch (err) {
    next(err);
  }
};

export const applyCoupon: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const coupon = await CouponModel.findOne({
      name: req.body.coupon,
      expire: { $gt: Date.now() },
    });
    if (!coupon) {
      throw createHttpError(404, "coupon is Expired");
    }

    const cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) {
      throw createHttpError(404, "user did not create a cart");
    }

    cart.totalPriceAfterDiscount = Math.round(
      cart.totalPrice - (cart.totalPrice * coupon.discount) / 100,
    );
    await cart.save();
    res.status(200).json({ data: cart });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const cart = await CartModel.findOneAndUpdate(
      { user: req.user._id },
      {
        $pull: { cartItems: { _id: req.params.itemId } },
      },
      { new: true },
    );
    if (!cart) {
      return res.status(404).json({ message: "Address not found" });
    }

    cart.totalPrice = calulateTotalPrice(cart);
    await cart.save();

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const clearCart: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const cart = await CartModel.findOneAndDelete({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
