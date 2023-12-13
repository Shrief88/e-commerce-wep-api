import { body } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import CategoryModel from "../models/category";
import { bodyCategoryRules } from "./rules/bodyRules";
import { validIdRule, existingIdRule } from "./rules/idRules";

export const getCategoryValidator = [
  ...validIdRule("ID is invalid"),
  ...existingIdRule(CategoryModel, "category does not exist"),
  validateMiddleware,
];

export const createCategoryValidator = [
  body("name").notEmpty().withMessage("name is required"),
  ...bodyCategoryRules,
  validateMiddleware,
];

export const updateCategoryValidator = [
  ...validIdRule("ID is invalid"),
  ...bodyCategoryRules.map((rule) => rule.optional()),
  ...existingIdRule(CategoryModel, "category does not exist"),
  validateMiddleware,
];

export const deleteCategoryValidator = [
  ...validIdRule("ID is invalid"),
  ...existingIdRule(CategoryModel, "category does not exist"),
  validateMiddleware,
];
