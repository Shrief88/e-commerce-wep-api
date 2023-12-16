import { body, param } from "express-validator";
import { bodyBrandRules } from "./rules/bodyRules";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createBrandValidator = [
  body("name").notEmpty().withMessage("name is required"),
  ...bodyBrandRules,
  validateMiddleware,
];

export const updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyBrandRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
