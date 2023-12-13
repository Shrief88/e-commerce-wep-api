import { body } from "express-validator";
import BrandModel from "../models/brand";
import { bodyBrandRules } from "./rules/bodyRules";
import { validIdRule, existingIdRule } from "./rules/idRules";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const getBrandValidator = [
  ...validIdRule("ID is invalid"),
  ...existingIdRule(BrandModel, "brand does not exist"),
  validateMiddleware,
];

export const createBrandValidator = [
  body("name").notEmpty().withMessage("name is required"),
  ...bodyBrandRules,
  validateMiddleware,
];

export const updateBrandValidator = [
  ...validIdRule("ID is invalid"),
  ...bodyBrandRules.map((rule) => rule.optional()),
  ...existingIdRule(BrandModel, "brand does not exist"),
  validateMiddleware,
];

export const deleteBrandValidator = [
  ...validIdRule("ID is invalid"),
  ...existingIdRule(BrandModel, "brand does not exist"),
  validateMiddleware,
];
