import { body, param } from "express-validator";

import validateMiddleware from "../middlewares/validatorMiddleware";
import { ProductModel } from "../models/product";

export const addToWishlist = [
  body("product")
    .notEmpty()
    .withMessage("product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID")
    .custom(async (id: string) => {
      if (!(await ProductModel.findById(id))) {
        throw new Error("Product not found");
      }
      return true;
    }),
  validateMiddleware,
];

export const removeFromWishlist = [
  param("product")
    .isMongoId()
    .withMessage("Invalid product ID")
    .custom(async (id: string) => {
      if (!(await ProductModel.findById(id))) {
        throw new Error("Product not found");
      }
      return true;
    }),
  validateMiddleware,
];
