import * as categoryController from "../controllers/category";
import express from "express";
import * as categoryValidator from "../validators/categoryValidator";

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
  categoryValidator.createCategoryValidator,
  categoryController.createCategory,
);

// @access private
categoryRouter.put(
  "/:id",
  categoryValidator.updateCategoryValidator,
  categoryController.updateCategory,
);

// @access private
categoryRouter.delete(
  "/:id",
  categoryValidator.deleteCategoryValidator,
  categoryController.deleteCategory,
);

export default categoryRouter;