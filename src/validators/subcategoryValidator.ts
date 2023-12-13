import validateMiddleware from "../middlewares/validatorMiddleware";
import { body } from "express-validator";
import { bodySubcategoryRules } from "./rules/bodyRules";
import { validIdRule, existingIdRule } from "./rules/idRules";
import SubcategoryModel from "../models/subcategory";

export const getSubCategoryValidator = [
  ...validIdRule("ID is invalid"),
  ...existingIdRule(SubcategoryModel, "subcategory does not exist"),
  validateMiddleware,
];

export const createSubcategoryValidator = [
  body("name").notEmpty().withMessage("name is required"),
  body("category").notEmpty().withMessage("category is required"),
  ...bodySubcategoryRules,
  validateMiddleware,
];

export const updateSubcategoryValidator = [
  ...validIdRule("ID is invalid"),
  ...bodySubcategoryRules.map((rule) => rule.optional()),
  ...existingIdRule(SubcategoryModel, "subcategory does not exist"),
  validateMiddleware,
];

export const deleteSubcategoryValidator = [
  ...validIdRule("ID is invalid"),
  ...existingIdRule(SubcategoryModel, "subcategory does not exist"),
  validateMiddleware,
];
