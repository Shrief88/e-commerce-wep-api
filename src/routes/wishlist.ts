import express from "express";

import * as wishlistController from "../controllers/wishlist";
import * as authController from "../controllers/auth";
import * as wishlistValidator from "../validators/wishlist";

const wishlistRouter = express.Router();

wishlistRouter.use(
  authController.protectRoute,
  authController.allowedTo("user"),
);

wishlistRouter.get("/", wishlistController.getUserWishlist);

wishlistRouter.post(
  "/",
  wishlistValidator.addToWishlist,
  wishlistController.addToWishlist,
);

wishlistRouter.delete(
  "/:product",
  wishlistValidator.removeFromWishlist,
  wishlistController.removeFromWishlist,
);

export default wishlistRouter;
