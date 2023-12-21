import express from "express";

import * as cartController from "../controllers/cart";
import * as authController from "../controllers/auth";
import * as cartValidator from "../validators/cart";

const cartRouter = express.Router();

cartRouter.use(authController.protectRoute, authController.allowedTo("user"));

cartRouter.get("/", cartController.getLoggedUserCart);

cartRouter.post("/", cartValidator.addToCart, cartController.addToCart);

cartRouter.put(
  "/coupon",
  cartController.applyCoupon,
  cartValidator.applyCoupon,
);

cartRouter.put("/:itemId", cartValidator.updateCart, cartController.updateCart);

cartRouter.delete(
  "/:itemId",
  cartValidator.removeFromCart,
  cartController.removeFromCart,
);

cartRouter.delete("/", cartController.clearCart);

export default cartRouter;
