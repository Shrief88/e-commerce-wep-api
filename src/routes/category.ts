import * as categoryController from "../controllers/category";
import express from "express";
import * as categoryValidator from "../validators/categoryValidator";
import subcategoryRouter from "./subcategory";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";
import validateImageExisting from "../middlewares/imageExistingMiddleWare";
import { protectRoute } from "../controllers/auth";

const categoryRouter = express.Router();

// @access public
categoryRouter.get("/", categoryController.getCategories);

// @access public
categoryRouter.get(
  "/:id",
  categoryValidator.getCategoryValidator,
  categoryController.getCategory,
);

// @access private
categoryRouter.post(
  "/",
  protectRoute,
  uploadSingleImage("image"),
  validateImageExisting,
  categoryValidator.createCategoryValidator,
  resizeSingleImage("category", "image"),
  categoryController.createCategory,
);

// @access private
categoryRouter.put(
  "/:id",
  uploadSingleImage("image"),
  categoryValidator.updateCategoryValidator,
  resizeSingleImage("category", "image"),
  categoryController.updateCategory,
);

// @access private
categoryRouter.delete(
  "/:id",
  categoryValidator.deleteCategoryValidator,
  categoryController.deleteCategory,
);

categoryRouter.use("/:categoryId/subcategories", subcategoryRouter);

export default categoryRouter;
