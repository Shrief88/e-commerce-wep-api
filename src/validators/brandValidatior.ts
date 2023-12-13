import { body, param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import { commonBrandValidationRules } from "./utils/commonValidators";

export const getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createBrandValidator = [
  body("name").notEmpty().withMessage("name is required"),
  ...commonBrandValidationRules,
  validateMiddleware,
];

export const updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...commonBrandValidationRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
