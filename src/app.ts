import express from "express";
import env from "./validators/validateEnv";
import morgan from "morgan";
import createHttpError from "http-errors";
import categoryRouter from "./routes/category";
import errorMiddleware from "./middlewares/errorMiddleware";
import subcategoryRouter from "./routes/subcategory";
import brandRouter from "./routes/brand";
import productRouter from "./routes/product";
import userRouter from "./routes/user";
import path from "path";

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

app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

app.use((_req, _res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// ERROR HANDLERS FOR EXPRESS
app.use(errorMiddleware);

export default app;
