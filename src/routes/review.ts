import express from "express";

import * as reviewController from "../controllers/review";
import * as reviewValidator from "../validators/reviewValidator";
import * as authController from "../controllers/auth";

const reviewRouter = express.Router();

reviewRouter.get("/", reviewController.getReviews);

reviewRouter.get(
  "/:id",
  reviewValidator.getReviewValidator,
  reviewController.getReview,
);

reviewRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("user"),
  reviewValidator.createReviewValidator,
  reviewController.createReview,
);

reviewRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("user"),
  reviewValidator.updateReviewValidator,
  reviewController.updateReview,
);

reviewRouter.delete(
  "/:id",
  authController.protectRoute,
  reviewValidator.deleteReviewValidator,
  reviewController.deleteReview,
);

export default reviewRouter;
