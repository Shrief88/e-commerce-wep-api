import express from "express";

import * as addressController from "../controllers/address";
import * as authController from "../controllers/auth";
import * as addressValidator from "../validators/address";

const addressRouter = express.Router();

addressRouter.use(
  authController.protectRoute,
  authController.allowedTo("user"),
);

addressRouter.get("/", addressController.getUserAddresses);

addressRouter.post(
  "/",
  addressValidator.addAddress,
  addressController.addAddress,
);

addressRouter.delete(
  "/:id",
  addressValidator.removeAddress,
  addressController.removeAddress,
);

addressRouter.put(
  "/:id",
  addressValidator.updateAddress,
  addressController.updateAddress,
);

export default addressRouter;
