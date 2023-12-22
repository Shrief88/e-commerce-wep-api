import express from "express";

import * as orderController from "../controllers/order";
import * as authController from "../controllers/auth";
import * as orderValidator from "../validators/order";

const orderRouter = express.Router();

orderRouter.use(authController.protectRoute);

orderRouter.post(
  "/:cartId",
  authController.allowedTo("user"),
  orderValidator.createCashOrder,
  orderController.createCashOrder,
);

orderRouter.get("/", orderController.getOrders);

orderRouter.get(
  "/checkout-session/:cartId",
  authController.allowedTo("user"),
  orderController.checkoutSession,
);

orderRouter.get(
  "/:id",
  authController.protectRoute,
  orderValidator.getOrder,
  orderController.getOrder,
);

orderRouter.put(
  "/:id/paid",
  authController.allowedTo("admin", "manager"),
  orderController.updatePaidStatus,
);

orderRouter.put(
  "/:id/delivered",
  authController.allowedTo("admin", "manager"),
  orderController.updateDeliveredStatus,
);

export default orderRouter;
