import express from "express";

import * as couponValidator from "../validators/coupon";
import * as authController from "../controllers/auth";
import * as couponController from "../controllers/coupon";

const couponRouter = express.Router();
couponRouter.use(
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
);

couponRouter.get("/", couponController.getCoupons);

couponRouter.get("/:id", couponValidator.getCoupon, couponController.getCoupon);

couponRouter.post(
  "/",
  couponValidator.createCoupon,
  couponController.createCoupon,
);

couponRouter.put(
  "/:id",
  couponValidator.updateCoupon,
  couponController.updateCoupon,
);

couponRouter.delete(
  "/:id",
  couponValidator.deleteCoupon,
  couponController.deleteCoupon,
);

export default couponRouter;
