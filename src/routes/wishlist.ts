import express from "express";

import * as wishlistController from "../controllers/wishlist";
import * as authController from "../controllers/auth";
import * as wishlistValidator from "../validators/wishlist";

const wishlistRouter = express.Router();

wishlistRouter.use(
  authController.protectRoute,
  authController.allowedTo("user"),
);

wishlistRouter.post(
  "/add",
  wishlistValidator.addToWishlist,
  wishlistController.addToWishlist,
);

wishlistRouter.delete(
  "/remove/:product",
  wishlistValidator.removeFromWishlist,
  wishlistController.removeFromWishlist,
);

wishlistRouter.get("/", wishlistController.getUserWishlist);

export default wishlistRouter;
