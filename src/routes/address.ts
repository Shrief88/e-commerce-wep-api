import express from "express";

import * as addressController from "../controllers/address";
import * as authController from "../controllers/auth";
import * as addressValidator from "../validators/addressValidator";

const addressRouter = express.Router();

addressRouter.use(
  authController.protectRoute,
  authController.allowedTo("user"),
);

addressRouter.post(
  "/",
  addressValidator.addAddressValidator,
  addressController.addAddress,
);

addressRouter.delete(
  "/:address",
  addressValidator.removeAddressValidator,
  addressController.removeAddress,
);

addressRouter.put(
  "/:address",
  addressValidator.updateAddressValidator,
  addressController.updateAddress,
);

addressRouter.get("/", addressController.getUserAddresses);

export default addressRouter;
