import { body, param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import { bodyProductRules } from "./rules/bodyRules";

export const getProductValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createProductValidator = [
  body("name").notEmpty().withMessage("name is required"),
  body("description").notEmpty().withMessage("description is required"),
  body("sold").optional(),
  body("quantity").notEmpty().withMessage("quantity is required"),
  body("price").notEmpty().withMessage("price is required"),
  body("priceAfterDiscount").optional(),
  body("colors").optional(),
  body("imageCover").notEmpty().withMessage("imageCover is required"),
  body("images").optional(),
  body("category").notEmpty().withMessage("category is required"),
  body("subcategories").optional(),
  body("brand").notEmpty().withMessage("brand is required"),
  body("ratingsAverage").optional(),
  body("ratingsQuantity").optional(),
  ...bodyProductRules,
  validateMiddleware,
];

export const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyProductRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteProductValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
