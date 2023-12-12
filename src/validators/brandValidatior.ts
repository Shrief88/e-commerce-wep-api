import { body, param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

const commonBrandValidationRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
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
