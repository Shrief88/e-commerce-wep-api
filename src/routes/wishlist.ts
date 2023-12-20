import express from "express";

import * as wishlistController from "../controllers/wishlist";
import * as authController from "../controllers/auth";
import * as wishlistValidator from "../validators/wishlistValidator";

const wishlistRouter = express.Router();

wishlistRouter.use(
  authController.protectRoute,
  authController.allowedTo("user"),
);

wishlistRouter.post(
  "/add",
  wishlistValidator.addToWishlistValidator,
  wishlistController.addToWishlist,
);

wishlistRouter.delete(
  "/remove/:product",
  wishlistValidator.removeFromWishlistValidator,
  wishlistController.removeFromWishlist,
);

wishlistRouter.get("/", wishlistController.getUserWishlist);

export default wishlistRouter;
