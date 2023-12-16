import validateMiddleware from "../middlewares/validatorMiddleware";
import { body, param } from "express-validator";
import SubcategoryModel from "../models/subcategory";
import CategoryModel from "../models/category";

const bodyRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  body("category").isMongoId().withMessage("category is invalid"),
  body("name").custom(async (name: string) => {
    if (await SubcategoryModel.findOne({ name }).exec()) {
      throw new Error("subcategory already exists");
    }
    return true;
  }),
  body("category").custom(async (category: string) => {
    if (!(await CategoryModel.findById(category).exec())) {
      throw new Error("category does not exist");
    }
    return true;
  }),
];

export const getSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createSubcategoryValidator = [
  body("name").notEmpty().withMessage("name is required"),
  body("category").notEmpty().withMessage("category is required"),
  ...bodyRules,
  validateMiddleware,
];

export const updateSubcategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteSubcategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
