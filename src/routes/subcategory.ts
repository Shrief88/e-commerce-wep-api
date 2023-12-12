import * as subcategoryController from "../controllers/subcategory";
import express from "express";
import * as subcategoryValidator from "../validators/subcategoryValidator";
import {
  setCategoryIdToBody,
  setFilterObject,
} from "../middlewares/subcategoryMiddleware";

const subcategoryRouter = express.Router({
  mergeParams: true,
});

// @access public
subcategoryRouter.get(
  "/",
  setFilterObject,
  subcategoryController.getSubcategories,
);

// @access public
subcategoryRouter.get(
  "/:id",
  subcategoryValidator.getSubCategoryValidator,
  subcategoryController.getsubcategory,
);

// @access private
subcategoryRouter.post(
  "/",
  setCategoryIdToBody,
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
