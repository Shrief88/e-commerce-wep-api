import { body, param } from "express-validator";

import { ProductModel } from "../models/product";
import { ReviewModel } from "../models/review";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const getReview = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createReview = [
  body("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating should be an integer from 1-5"),
  body("product")
    .notEmpty()
    .withMessage("product is required")
    .isMongoId()
    .withMessage("Invalid product ID")
    .custom(async (id: string) => {
      if (!(await ProductModel.findById(id).exec())) {
        throw new Error("Invalid Product ID");
      }
      return true;
    })
    .custom(async (product: string, { req }) => {
      if (
        await ReviewModel.findOne({
          user: req.user._id,
          product,
        })
      ) {
        throw new Error("User already reviewed this product");
      }
      return true;
    }),
  validateMiddleware,
];

export const updateReview = [
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

export const deleteReview = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ID")
    .custom(async (id, { req }) => {
      const review = await ReviewModel.findById(id).exec();
      if (!review) {
        throw new Error("Review not found");
      }
      const { _id } = review.user as unknown as { _id: string };
      if (
        req.user.role === "user" &&
        _id.toString() !== req.user._id.toString()
      ) {
        throw new Error("This review is not belong to this user");
      }
      return true;
    }),
  validateMiddleware,
];
