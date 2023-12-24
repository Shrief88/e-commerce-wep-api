import path from "path";

import express, { type RequestHandler } from "express";
import morgan from "morgan";
import createHttpError from "http-errors";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";

import env from "./config/validateEnv";
import errorMiddleware from "./middlewares/errorMiddleware";
import mountRoutes from "./routes";

const app = express();

app.use(cors());
const corsOptions: RequestHandler = cors();
app.options("*", corsOptions);

app.use(compression());

// MIDDLEWARE
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "20kb" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "uploads")));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests created , please try again later",
  }),
);

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
