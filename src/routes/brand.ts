import * as brandController from "../controllers/brand";
import express from "express";
import * as brandValidator from "../validators/brandValidatior";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeImage } from "../middlewares/imageProcessingMiddleware";
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
  uploadSingleImage,
  validateImageExisting,
  brandValidator.createBrandValidator,
  resizeImage("brand"),
  brandController.createBrand,
);

// @access private
brandRouter.put(
  "/:id",
  uploadSingleImage,
  brandValidator.updateBrandValidator,
  resizeImage("brand"),
  brandController.updateBrand,
);

// @access private
brandRouter.delete(
  "/:id",
  brandValidator.deleteBrandValidator,
  brandController.deleteBrand,
);

export default brandRouter;
