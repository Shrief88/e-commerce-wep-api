import { body, param } from "express-validator";

import CategoryModel from "../models/category";
import validateMiddleware from "../middlewares/validatorMiddleware";

const bodyRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long")
    .custom(async (name: string) => {
      if (await CategoryModel.findOne({ name }).exec()) {
        throw new Error("category already exists");
      }
      return true;
    }),
];

export const getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createCategoryValidator = [
  body("name").notEmpty().withMessage("name is required"),
  ...bodyRules,
  validateMiddleware,
];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
