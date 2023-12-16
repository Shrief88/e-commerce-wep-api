import { body, param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import UserModel from "../models/user";
import bycrpt from "bcryptjs";

const bodyUserRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("phone").trim().isMobilePhone("ar-EG").withMessage("Invalid phone"),
  body("address").isString().withMessage("address must be a string"),
  body("email").custom(async (email: string) => {
    if (await UserModel.findOne({ email }).exec()) {
      throw new Error("user email already exists");
    }
    return true;
  }),
  body("phone").custom(async (phone: string) => {
    if (await UserModel.findOne({ phone }).exec()) {
      throw new Error("user phone already exists");
    }
    return true;
  }),
];

export const getUserValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createUserValidator = [
  body("name").notEmpty().withMessage("name is required"),
  body("email").notEmpty().withMessage("email is required"),
  body("phone").notEmpty().withMessage("phone is required"),
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
  body("address").notEmpty().withMessage("address is required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("password Confirmation is required"),
  ...bodyUserRules,
  validateMiddleware,
];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyUserRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const updateUserPasswordValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
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
  body("currentPassword")
    .notEmpty()
    .withMessage("current password is required")
    .custom(async (currentPassword, { req }) => {
      const user = await UserModel.findById(req.params?.id).exec();
      if (!user) {
        throw new Error("user not found");
      }
      if (!bycrpt.compareSync(currentPassword as string, user.password)) {
        throw new Error("current password is incorrect");
      }
      return true;
    }),
  validateMiddleware,
];

export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
