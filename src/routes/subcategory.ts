import * as subcategoryController from "../controllers/subcategory";
import express from "express";
import * as subcategoryValidator from "../validators/subcategoryValidator";
import {
  setCategoryIdToBody,
  setFilterObject,
} from "../middlewares/subcategoryMiddleware";
import * as authController from "../controllers/auth";

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
  subcategoryController.getSubcategory,
);

// @access private [admin, manager]
subcategoryRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  setCategoryIdToBody,
  subcategoryValidator.createSubcategoryValidator,
  subcategoryController.createsubcategory,
);

// @access private [admin, manager]
subcategoryRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  subcategoryValidator.updateSubcategoryValidator,
  subcategoryController.updatesubcategory,
);

// @access private
subcategoryRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  subcategoryValidator.deleteSubcategoryValidator,
  subcategoryController.deletesubcategory,
);

export default subcategoryRouter;
