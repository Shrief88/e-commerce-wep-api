import { body, param } from "express-validator";

import { OrderModel } from "../models/order";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const createOrder = [
  param("cartId").isMongoId().withMessage("Invalid cart ID"),
  body("shippingAddress.details")
    .notEmpty()
    .withMessage("details is required")
    .isString()
    .withMessage("details must be a string"),
  body("shippingAddress.phone")
    .notEmpty()
    .withMessage("phone is required")
    .trim()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone"),
  body("shippingAddress.city")
    .notEmpty()
    .withMessage("city is required")
    .isString()
    .withMessage("city must be a string"),
  body("shippingAddress.postcode")
    .notEmpty()
    .withMessage("postcode is required")
    .isString()
    .withMessage("postcode must be a string"),
  validateMiddleware,
];

export const getOrder = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID")
    .custom(async (id, { req }) => {
      const order = await OrderModel.findById(id);
      if (!order) {
        throw new Error("Order not found");
      }
      if (
        order.user.toString() !== req.user._id.toString() &&
        req.user.role === "user"
      ) {
        throw new Error("Only admin or manager can see other users orders");
      }
    }),
  validateMiddleware,
];

export const updateDeliveredStatus = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const updatePaidStatus = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
