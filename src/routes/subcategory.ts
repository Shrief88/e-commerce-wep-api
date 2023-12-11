import * as subcategoryController from "../controllers/subcategory";
import express from "express";
import * as subcategoryValidator from "../validators/subcategoryValidator";

const subcategoryRouter = express.Router();

// @access public
subcategoryRouter.get("/", subcategoryController.getSubcategories);

// @access public
subcategoryRouter.get(
  "/:id",
  subcategoryValidator.getSubCategoryValidator,
  subcategoryController.getsubcategory,
);

// @access private
subcategoryRouter.post(
  "/",
  subcategoryValidator.createSubcategoryValidator,
  subcategoryController.createsubcategory,
);

// @access private
subcategoryRouter.put(
  "/:id",
  subcategoryValidator.updateSubcategoryValidator,
  subcategoryController.updatesubcategory,
);

// @access private
subcategoryRouter.delete(
  "/:id",
  subcategoryValidator.deleteSubcategoryValidator,
  subcategoryController.deletesubcategory,
);

export default subcategoryRouter;
