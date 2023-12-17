import express from "express";
import env from "./config/validateEnv";
import morgan from "morgan";
import createHttpError from "http-errors";
import categoryRouter from "./routes/category";
import errorMiddleware from "./middlewares/errorMiddleware";
import subcategoryRouter from "./routes/subcategory";
import brandRouter from "./routes/brand";
import productRouter from "./routes/product";
import userRouter from "./routes/user";
import path from "path";
import authRouter from "./routes/auth";

const app = express();

// MIDDLEWARE
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "uploads")));

// ROUTES
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

app.use((_req, _res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// ERROR HANDLERS FOR EXPRESS
app.use(errorMiddleware);

export default app;
