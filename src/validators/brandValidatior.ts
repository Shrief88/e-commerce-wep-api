import { body, param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createBrandValidator = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  validateMiddleware,
];

export const updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  body("name")
    .optional()
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  validateMiddleware,
];

export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
