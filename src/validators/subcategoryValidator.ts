import validateMiddleware from "../middlewares/validatorMiddleware";
import { body, param } from "express-validator";

export const getSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

const commonSubcategoryValidationRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  body("category").isMongoId().withMessage("Invalid category ID"),
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
