import validateMiddleware from "../middlewares/validatorMiddleware";
import { body, param } from "express-validator";
import { commonSubcategoryValidationRules } from "./utils/commonValidators";

export const getSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createSubcategoryValidator = [
  body("name").notEmpty().withMessage("name is required"),
  body("category").notEmpty().withMessage("category is required"),
  ...commonSubcategoryValidationRules,
  validateMiddleware,
];

export const updateSubcategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...commonSubcategoryValidationRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteSubcategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
