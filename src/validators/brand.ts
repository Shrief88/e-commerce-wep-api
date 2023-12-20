import { body, param } from "express-validator";

import { BrandModel } from "../models/brand";
import validateMiddleware from "../middlewares/validatorMiddleware";

const bodyRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long")
    .custom(async (name: string) => {
      if (await BrandModel.findOne({ name }).exec()) {
        throw new Error("brand already exists");
      }
      return true;
    }),
];

export const getBrand = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createBrand = [
  body("name").notEmpty().withMessage("name is required"),
  ...bodyRules,
  validateMiddleware,
];

export const updateBrand = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteBrand = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
