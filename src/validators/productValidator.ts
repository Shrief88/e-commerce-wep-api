import { body } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import { bodyProductRules } from "./rules/bodyRules";
import { validIdRule, existingIdRule } from "./rules/idRules";
import ProductModel from "../models/product";

export const getProductValidator = [
  ...validIdRule("ID is invalid"),
  ...existingIdRule(ProductModel, "product does not exist"),
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
  ...validIdRule("ID is invalid"),
  ...bodyProductRules.map((rule) => rule.optional()),
  ...existingIdRule(ProductModel, "product does not exist"),
  validateMiddleware,
];

export const deleteProductValidator = [
  ...validIdRule("ID is invalid"),
  ...existingIdRule(ProductModel, "product does not exist"),
  validateMiddleware,
];
