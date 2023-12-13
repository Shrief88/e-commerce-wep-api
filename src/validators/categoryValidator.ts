import { body, param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import { commonCategoryValidationRules } from "./utils/commonValidators";

export const getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createCategoryValidator = [
  body("name").notEmpty().withMessage("name is required"),
  ...commonCategoryValidationRules,
  validateMiddleware,
];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...commonCategoryValidationRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
