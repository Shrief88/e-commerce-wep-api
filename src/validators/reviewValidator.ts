import { body, param } from "express-validator";

import UserModel from "../models/user";
import ProductModel from "../models/product";
import ReviewModel from "../models/review";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const getReviewValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createReviewValidator = [
  body("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating should be an integer from 1-5"),
  body("user")
    .notEmpty()
    .withMessage("user is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("product")
    .notEmpty()
    .withMessage("product is required")
    .isMongoId()
    .withMessage("Invalid product ID"),
  body("user").custom(async (user: string, { req }) => {
    // check if user exists
    if (!(await UserModel.findById(user).exec())) {
      throw new Error("Invalid User ID");
    }

    // check if user is the same as the logged in user
    if (user !== req.user._id.toString()) {
      throw new Error("You can review only in your account");
    }

    // check if user has already reviewed this product
    if (
      await ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      }).exec()
    ) {
      throw new Error("User already reviewed this product");
    }
    return true;
  }),
  body("product").custom(async (id: string) => {
    if (!(await ProductModel.findById(id).exec())) {
      throw new Error("Invalid Product ID");
    }
    return true;
  }),
  validateMiddleware,
];

export const updateReviewValidator = [
  body("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating should be an integer from 1-5")
    .optional(),
  param("id")
    .isMongoId()
    .withMessage("Invalid ID")
    .custom(async (id, { req }) => {
      const review = await ReviewModel.findById(id).exec();
      if (!review) {
        throw new Error("Review not found");
      }

      // getting userId from review because we applied populate in review model to return an object with user_id
      const { _id } = review.user as unknown as { _id: string };
      if (_id.toString() !== req.user._id.toString()) {
        throw new Error("This review is not belong to this user");
      }
      return true;
    }),
  validateMiddleware,
];

export const deleteReviewValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ID")
    .custom(async (id, { req }) => {
      const review = await ReviewModel.findById(id).exec();
      if (!review) {
        throw new Error("Review not found");
      }
      if (req.user.role === "user" && review.user !== req.user._id) {
        throw new Error("This review is not belong to this user");
      }
      return true;
    }),
  validateMiddleware,
];
