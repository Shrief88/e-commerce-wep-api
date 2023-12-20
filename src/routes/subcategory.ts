import express from "express";

import * as subcategoryController from "../controllers/subcategory";
import * as subcategoryValidator from "../validators/subcategory";
import * as authController from "../controllers/auth";
import {
  setCategoryIdToBody,
  setFilterObject,
} from "../middlewares/categoryToSubcategory";

const subcategoryRouter = express.Router({
  mergeParams: true,
});

subcategoryRouter.get(
  "/",
  setFilterObject,
  subcategoryController.getSubcategories,
);

subcategoryRouter.get(
  "/:id",
  subcategoryValidator.getSubCategory,
  subcategoryController.getSubcategory,
);

subcategoryRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  setCategoryIdToBody,
  subcategoryValidator.createSubcategory,
  subcategoryController.createsubcategory,
);

subcategoryRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  subcategoryValidator.updateSubcategory,
  subcategoryController.updatesubcategory,
);

subcategoryRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  subcategoryValidator.deleteSubcategory,
  subcategoryController.deletesubcategory,
);

export default subcategoryRouter;
