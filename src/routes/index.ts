import { type Express } from "express";

import categoryRouter from "./category";
import subcategoryRouter from "./subcategory";
import productRouter from "./product";
import userRouter from "./user";
import brandRouter from "./brand";
import reviewRouter from "./review";
import wishlistRouter from "./wishlist";
import addressRouter from "./address";
import couponRouter from "./coupon";
import authRouter from "./auth";
import cartRouter from "./cart";

const mountRoutes = (app: Express): void => {
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/subcategory", subcategoryRouter);
  app.use("/api/v1/brand", brandRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/review", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/address", addressRouter);
  app.use("/api/v1/coupon", couponRouter);
  app.use("/api/v1/cart", cartRouter);
};

export default mountRoutes;
