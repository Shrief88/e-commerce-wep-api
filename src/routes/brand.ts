import express from "express";

import * as brandValidator from "../validators/brandValidator";
import * as authController from "../controllers/auth";
import * as brandController from "../controllers/brand";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";
import validateImageExisting from "../middlewares/imageExistingMiddleWare";

const brandRouter = express.Router();

brandRouter.get("/", brandController.getBrands);

brandRouter.get(
  "/:id",
  brandValidator.getBrandValidator,
  brandController.getBrand,
);

brandRouter.post(
  "/",

  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadSingleImage("image"),
  validateImageExisting,
  brandValidator.createBrandValidator,
  resizeSingleImage("brand", "image"),
  brandController.createBrand,
);

brandRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadSingleImage("image"),
  brandValidator.updateBrandValidator,
  resizeSingleImage("brand", "image"),
  brandController.updateBrand,
);

brandRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  brandValidator.deleteBrandValidator,
  brandController.deleteBrand,
);

export default brandRouter;
