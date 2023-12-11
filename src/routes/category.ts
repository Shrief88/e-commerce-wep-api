import * as categoryController from "../controllers/category";
import express from "express";

const categoryRouter = express.Router();

// @access public
categoryRouter.get("/", categoryController.getCategories);

// @access public
categoryRouter.get("/:id", categoryController.getCategory);

// @access private
categoryRouter.post("/", categoryController.createCategory);

// @access private
categoryRouter.put("/:id", categoryController.updateCategory);

// @access private
categoryRouter.delete("/:id", categoryController.deleteCategory);

export default categoryRouter;
