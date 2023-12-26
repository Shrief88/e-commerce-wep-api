import { body, param } from "express-validator";

import { UserModel } from "../models/user";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const addAddress = [
  body("address.alias")
    .notEmpty()
    .withMessage("alias is required")
    .isString()
    .withMessage("alias must be a string"),
  body("address.details")
    .notEmpty()
    .withMessage("details is required")
    .isString()
    .withMessage("details must be a string"),
  body("address.phone")
    .notEmpty()
    .withMessage("phone is required")
    .trim()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone"),
  body("address.city")
    .notEmpty()
    .withMessage("city is required")
    .isString()
    .withMessage("city must be a string"),
  body("address.postcode")
    .notEmpty()
    .withMessage("postcode is required")
    .isString()
    .withMessage("postcode must be a string"),
  body("address.alias").custom(async (value, { req }) => {
    console.log(value);
    const user = await UserModel.findById(req.user._id);
    const addressLength = user?.addresses?.length ?? 0;
    if (addressLength > 0) {
      const check = user?.addresses?.every(
        (address) => address.alias === value,
      );
      if (check) {
        throw new Error("alias already exists");
      }
    }
    return true;
  }),
  validateMiddleware,
];

export const updateAddress = [
  param("id").isMongoId().withMessage("Invalid address ID"),
  body("address.alias")
    .optional()
    .isString()
    .withMessage("alias must be a string"),
  body("address.details")
    .optional()
    .isString()
    .withMessage("details must be a string"),
  body("address.phone")
    .optional()
    .trim()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone"),
  body("address.city")
    .optional()
    .isString()
    .withMessage("city must be a string"),
  body("address.postcode")
    .optional()
    .isString()
    .withMessage("postcode must be a string"),
  validateMiddleware,
];

export const removeAddress = [
  param("id").isMongoId().withMessage("Invalid address ID"),
  validateMiddleware,
];
