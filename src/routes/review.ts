import express from "express";

import * as reviewController from "../controllers/review";
import * as reviewValidator from "../validators/reviewValidator";
import * as authController from "../controllers/auth";
import {
  setProductIdToBody,
  setFilterObject,
} from "../middlewares/productToReview";

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.get("/", setFilterObject, reviewController.getReviews);

reviewRouter.get(
  "/:id",
  reviewValidator.getReviewValidator,
  reviewController.getReview,
);

reviewRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("user"),
  setProductIdToBody,
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
