import * as brandController from "../controllers/brand";
import express from "express";
import * as brandValidator from "../validators/brandValidatior";

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
  brandValidator.createBrandValidator,
  brandController.createBrand,
);

// @access private
brandRouter.put(
  "/:id",
  brandValidator.updateBrandValidator,
  brandController.updateBrand,
);

// @access private
brandRouter.delete(
  "/:id",
  brandValidator.deleteBrandValidator,
  brandController.deleteBrand,
);

export default brandRouter;
