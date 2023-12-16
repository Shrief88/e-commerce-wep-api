import { body, param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import { bodyUserRules } from "./rules/bodyRules";

export const getUserValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createUserValidator = [
  body("name").notEmpty().withMessage("name is required"),
  body("email").notEmpty().withMessage("email is required"),
  body("phone").notEmpty().withMessage("phone is required"),
  body("password").notEmpty().withMessage("password is required"),
  body("address").notEmpty().withMessage("address is required"),
  ...bodyUserRules,
  validateMiddleware,
];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyUserRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
