import validateMiddleware from "../middlewares/validatorMiddleware";
import { body, param } from "express-validator";

export const getSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createSubcategoryValidator = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Name must be at most 32 characters long"),
  body("category").isMongoId().withMessage("Invalid category ID"),
  validateMiddleware,
];

export const updateSubcategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Name must be at most 32 characters long"),
  body("category").optional().isMongoId().withMessage("Invalid category ID"),
  validateMiddleware,
];

export const deleteSubcategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
