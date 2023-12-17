import express from "express";

import * as subcategoryController from "../controllers/subcategory";
import * as subcategoryValidator from "../validators/subcategoryValidator";
import * as authController from "../controllers/auth";
import {
  setCategoryIdToBody,
  setFilterObject,
} from "../middlewares/subcategoryMiddleware";

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
  subcategoryValidator.getSubCategoryValidator,
  subcategoryController.getSubcategory,
);

subcategoryRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  setCategoryIdToBody,
  subcategoryValidator.createSubcategoryValidator,
  subcategoryController.createsubcategory,
);

subcategoryRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  subcategoryValidator.updateSubcategoryValidator,
  subcategoryController.updatesubcategory,
);

subcategoryRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  subcategoryValidator.deleteSubcategoryValidator,
  subcategoryController.deletesubcategory,
);

export default subcategoryRouter;
