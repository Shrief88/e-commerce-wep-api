import { body, param } from "express-validator";

import { UserModel } from "../models/user";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const addAddress = [
  body("alias")
    .notEmpty()
    .withMessage("alias is required")
    .isString()
    .withMessage("alias must be a string"),
  body("details")
    .notEmpty()
    .withMessage("details is required")
    .isString()
    .withMessage("details must be a string"),
  body("phone")
    .notEmpty()
    .withMessage("phone is required")
    .trim()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone"),
  body("city")
    .notEmpty()
    .withMessage("city is required")
    .isString()
    .withMessage("city must be a string"),
  body("postcode")
    .notEmpty()
    .withMessage("postcode is required")
    .isString()
    .withMessage("postcode must be a string"),
  body("alias").custom(async (value, { req }) => {
    console.log(value);
    const user = await UserModel.findById(req.user._id);
    const check = user?.addresses?.find((address) => address.alias === value);
    if (check) {
      throw new Error("alias already exists");
    }
    return true;
  }),
  validateMiddleware,
];

export const updateAddress = [
  param("address").isMongoId().withMessage("Invalid address ID"),
  body("alias").optional().isString().withMessage("alias must be a string"),
  body("details").optional().isString().withMessage("details must be a string"),
  body("phone")
    .optional()
    .trim()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone"),
  body("city").optional().isString().withMessage("city must be a string"),
  body("postcode")
    .optional()
    .isString()
    .withMessage("postcode must be a string"),
  validateMiddleware,
];

export const removeAddress = [
  param("address").isMongoId().withMessage("Invalid address ID"),
  validateMiddleware,
];
