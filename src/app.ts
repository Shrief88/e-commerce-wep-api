import express from "express";
import env from "./utils/validateEnv";
import morgan from "morgan";
import createHttpError from "http-errors";
import categoryRouter from "./routes/category";
import errorMiddleware from "./middlewares/errorMiddleware";

const app = express();

// MIDDLEWARE
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

// ROUTES
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use("/api/category", categoryRouter);

app.use((_req, _res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// ERROR HANDLERS
app.use(errorMiddleware);

export default app;
