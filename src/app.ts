import path from "path";

import express from "express";
import morgan from "morgan";
import createHttpError from "http-errors";

import env from "./config/validateEnv";
import errorMiddleware from "./middlewares/errorMiddleware";
import mountRoutes from "./routes";

const app = express();

// MIDDLEWARE
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "uploads")));

// ROUTES
mountRoutes(app);
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use((_req, _res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// ERROR HANDLERS FOR EXPRESS
app.use(errorMiddleware);

export default app;
