import { body, param } from "express-validator";

import validateMiddleware from "../middlewares/validatorMiddleware";
import { ProductModel } from "../models/product";
import { CouponModel } from "../models/coupon";

export const addToCart = [
  body("product")
    .notEmpty()
    .withMessage("product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isInt()
    .withMessage("quantity should be an integer"),
  body("color")
    .notEmpty()
    .withMessage("color is required")
    .isString()
    .withMessage("color must be a string"),
  body("product").custom(async (id: string, { req }) => {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.quantity < 1) {
      throw new Error("Product out of stock");
    }

    if (product.quantity - req.body.quantity < 0) {
      throw new Error("This product is not available in desired quantity");
    }
    if (!product.colors?.includes(req.body.color as string)) {
      throw new Error("Product color not available");
    }
    return true;
  }),
  validateMiddleware,
];

export const removeFromCart = [
  param("itemId").isMongoId().withMessage("Invalid item Cart ID"),
  validateMiddleware,
];

export const updateCart = [
  param("itemId").isMongoId().withMessage("Invalid item Cart ID"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isInt()
    .withMessage("quantity should be an integer"),
  validateMiddleware,
];

export const applyCoupon = [
  body("coupon")
    .notEmpty()
    .withMessage("coupon is required")
    .isString()
    .withMessage("name must be a string")
    .isUppercase()
    .withMessage("name must be uppercase")
    .custom(async (coupon: string) => {
      if (!(await CouponModel.findOne({ name: coupon }))) {
        throw new Error("coupon not found");
      }
      return true;
    }),
];
