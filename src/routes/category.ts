import * as categoryController from "../controllers/category";
import express from "express";
import * as categoryValidator from "../validators/categoryValidator";
import subcategoryRouter from "./subcategory";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";
import validateImageExisting from "../middlewares/imageExistingMiddleWare";
import * as authController from "../controllers/auth";

const categoryRouter = express.Router();

// @access public
categoryRouter.get("/", categoryController.getCategories);

// @access public
categoryRouter.get(
  "/:id",
  categoryValidator.getCategoryValidator,
  categoryController.getCategory,
);

// @access private [admin, manager]
categoryRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadSingleImage("image"),
  validateImageExisting,
  categoryValidator.createCategoryValidator,
  resizeSingleImage("category", "image"),
  categoryController.createCategory,
);

// @access private [admin, manager]
categoryRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadSingleImage("image"),
  categoryValidator.updateCategoryValidator,
  resizeSingleImage("category", "image"),
  categoryController.updateCategory,
);

// @access private [admin]
categoryRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  categoryValidator.deleteCategoryValidator,
  categoryController.deleteCategory,
);

categoryRouter.use("/:categoryId/subcategories", subcategoryRouter);

export default categoryRouter;
