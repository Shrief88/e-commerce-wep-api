import express from "express";

import * as categoryController from "../controllers/category";
import * as categoryValidator from "../validators/category";
import * as authController from "../controllers/auth";
import subcategoryRouter from "./subcategory";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";
import validateImageExisting from "../middlewares/imageExistingMiddleWare";

const categoryRouter = express.Router();

categoryRouter.get("/", categoryController.getCategories);

categoryRouter.get(
  "/:id",
  categoryValidator.getCategory,
  categoryController.getCategory,
);

categoryRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadSingleImage("image"),
  validateImageExisting,
  categoryValidator.createCategory,
  resizeSingleImage("category", "image"),
  categoryController.createCategory,
);

categoryRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadSingleImage("image"),
  categoryValidator.updateCategory,
  resizeSingleImage("category", "image"),
  categoryController.updateCategory,
);

categoryRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  categoryValidator.deleteCategory,
  categoryController.deleteCategory,
);

// Move all requests to api/v1/category/:categoryId/subcategories to subcategoryRouter
categoryRouter.use("/:categoryId/subcategories", subcategoryRouter);

export default categoryRouter;
