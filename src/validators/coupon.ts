import { body, param } from "express-validator";

import { CouponModel } from "../models/coupon";
import validateMiddleware from "../middlewares/validatorMiddleware";

const bodyRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .isUppercase()
    .withMessage("name must be uppercase"),
  body("expire").isDate().withMessage("expire must be a date"),
  body("discount").isNumeric().withMessage("discount must be a number"),
  body("name").custom(async (name: string) => {
    if (await CouponModel.findOne({ name }).exec()) {
      throw new Error("coupon already exists");
    }
    return true;
  }),
];

export const getCoupon = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createCoupon = [
  body("name").notEmpty().withMessage("name is required"),
  ...bodyRules,
  validateMiddleware,
];

export const updateCoupon = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteCoupon = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
