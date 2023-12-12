import { body, param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

const commonCategoryValidationRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
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
