import express from "express";

import * as productValidator from "../validators/product";
import * as productController from "../controllers/product";
import * as authController from "../controllers/auth";
import reviewRouter from "./review";
import { uploadMixImages } from "../middlewares/uploadImageMiddleware";
import { resizeMixImage } from "../middlewares/imageProcessingMiddleware";
import validateImageExisting from "../middlewares/imageExistingMiddleWare";

const productRouter = express.Router();

productRouter.get("/", productController.getproducts);

productRouter.get(
  "/:id",
  productValidator.getProduct,
  productController.getProduct,
);

productRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadMixImages([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validateImageExisting,
  productValidator.createProduct,
  resizeMixImage("product"),
  productController.createProduct,
);

productRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  uploadMixImages([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  productValidator.updateProduct,
  resizeMixImage("product"),
  productController.updateProduct,
);

productRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  productValidator.deleteProduct,
  productController.deleteProduct,
);

// Move all requests to api/v1/product/:productId/reviews to reviewRouter
productRouter.use("/:productId/reviews", reviewRouter);

export default productRouter;
