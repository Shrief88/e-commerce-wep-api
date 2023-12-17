import * as brandController from "../controllers/brand";
import express from "express";
import * as brandValidator from "../validators/brandValidator";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";
import validateImageExisting from "../middlewares/imageExistingMiddleWare";
import * as authController from "../controllers/auth";

const brandRouter = express.Router();

// @access public
brandRouter.get("/", brandController.getBrands);

// @access public
brandRouter.get(
  "/:id",
  brandValidator.getBrandValidator,
  brandController.getBrand,
);

// @access private [admin, manager]
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

// @access private [admin, manager]
brandRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadSingleImage("image"),
  brandValidator.updateBrandValidator,
  resizeSingleImage("brand", "image"),
  brandController.updateBrand,
);

// @access private [admin]
brandRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  brandValidator.deleteBrandValidator,
  brandController.deleteBrand,
);

export default brandRouter;
