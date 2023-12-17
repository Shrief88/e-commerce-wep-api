import * as productController from "../controllers/product";
import express from "express";
import * as productValidator from "../validators/productValidator";
import { uploadMixImages } from "../middlewares/uploadImageMiddleware";
import { resizeMixImage } from "../middlewares/imageProcessingMiddleware";
import validateImageExisting from "../middlewares/imageExistingMiddleWare";
import * as authController from "../controllers/auth";

const productRouter = express.Router();

// @access public
productRouter.get("/", productController.getproducts);

// @access public
productRouter.get(
  "/:id",
  productValidator.getProductValidator,
  productController.getProduct,
);

// @access private [admin, manager]
productRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadMixImages([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validateImageExisting,
  productValidator.createProductValidator,
  resizeMixImage("product"),
  productController.createProduct,
);

// @access private [admin, manager]
productRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadMixImages([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  productValidator.updateProductValidator,
  resizeMixImage("product"),
  productController.updateProduct,
);

// @access private [admin]
productRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  productValidator.deleteProductValidator,
  productController.deleteProduct,
);

export default productRouter;
