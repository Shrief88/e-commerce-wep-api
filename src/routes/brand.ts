import * as brandController from "../controllers/brand";
import express from "express";
import * as brandValidator from "../validators/brandValidator";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";
import validateImageExisting from "../middlewares/imageExistingMiddleWare";

const brandRouter = express.Router();

// @access public
brandRouter.get("/", brandController.getBrands);

// @access public
brandRouter.get(
  "/:id",
  brandValidator.getBrandValidator,
  brandController.getBrand,
);

// @access private
brandRouter.post(
  "/",
  uploadSingleImage("image"),
  validateImageExisting,
  brandValidator.createBrandValidator,
  resizeSingleImage("brand", "image"),
  brandController.createBrand,
);

// @access private
brandRouter.put(
  "/:id",
  uploadSingleImage("image"),
  brandValidator.updateBrandValidator,
  resizeSingleImage("brand", "image"),
  brandController.updateBrand,
);

// @access private
brandRouter.delete(
  "/:id",
  brandValidator.deleteBrandValidator,
  brandController.deleteBrand,
);

export default brandRouter;
