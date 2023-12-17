import { body } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import UserModel from "../models/user";

export const signupValidator = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("password Confirmation is required"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Too short password")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("passwords don't match");
      }
      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (email: string) => {
      if (await UserModel.findOne({ email }).exec()) {
        throw new Error("user email already exists");
      }
      return true;
    }),
  validateMiddleware,
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("password is required"),
  validateMiddleware,
];

export const forgetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),
  validateMiddleware,
];

export const verifyResetCodeValidator = [
  body("code").notEmpty().withMessage("code is required"),
  validateMiddleware,
];

export const resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Too short password"),
  validateMiddleware,
];
