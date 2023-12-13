import * as productController from "../controllers/product";
import express from "express";
import * as productValidator from "../validators/productValidator";

const productRouter = express.Router();

// @access public
productRouter.get("/", productController.getproducts);

// @access public
productRouter.get(
  "/:id",
  productValidator.getProductValidator,
  productController.getProduct,
);

// @access private
productRouter.post(
  "/",
  productValidator.createProductValidator,
  productController.createProduct,
);

// @access private
productRouter.put(
  "/:id",
  productValidator.updateProductValidator,
  productController.updateProduct,
);

// @access private
productRouter.delete(
  "/:id",
  productValidator.deleteProductValidator,
  productController.deleteProduct,
);

export default productRouter;
