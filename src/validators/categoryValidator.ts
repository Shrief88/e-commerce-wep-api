import { body, param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import { bodyCategoryRules } from "./rules/bodyRules";

export const getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createCategoryValidator = [
  body("name").notEmpty().withMessage("name is required"),
  ...bodyCategoryRules,
  validateMiddleware,
];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyCategoryRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
