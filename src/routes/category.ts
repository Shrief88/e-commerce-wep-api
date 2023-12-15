import * as categoryController from "../controllers/category";
import express from "express";
import * as categoryValidator from "../validators/categoryValidator";
import subcategoryRouter from "./subcategory";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeImage } from "../middlewares/imageProcessingMiddleware";
import validateImageExisting from "../middlewares/imageExistingMiddleWare";

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
  uploadSingleImage,
  validateImageExisting,
  categoryValidator.createCategoryValidator,
  resizeImage("category"),
  categoryController.createCategory,
);

// @access private
categoryRouter.put(
  "/:id",
  uploadSingleImage,
  categoryValidator.updateCategoryValidator,
  resizeImage("category"),
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
