import path from "path";

import express, { type RequestHandler } from "express";
import morgan from "morgan";
import createHttpError from "http-errors";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import helmet from "helmet";

import env from "./config/validateEnv";
import errorMiddleware from "./middlewares/errorMiddleware";
import mountRoutes from "./routes";
import { webhookCheckout } from "./controllers/order";
import { xssFilter } from "./middlewares/xssCleanMiddleware";

const app = express();
app.set("trust proxy", 1);

// MIDDLEWARE
app.use(cors());
const corsOptions: RequestHandler = cors();
app.options("*", corsOptions);

app.use(compression());
app.use(helmet());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// WEBHOOK to handle Stripe payment
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

app.use(express.json({ limit: "20kb" }));
app.use(express.json());

// Prevent HTTP Parameter pollution
app.use(
  hpp({
    whitelist: ["price", "sold", "quantity", "ratingAverage", "ratingQuantity"],
  }),
);

// Sanitize data against NoSQL query injection
app.use(ExpressMongoSanitize());

// Sanitize data against XSS attack
app.use(xssFilter);

// Set static folder for image
app.use(express.static(path.join(__dirname, "..", "uploads")));

// Set rate limit
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    legacyHeaders: false,
    standardHeaders: "draft-7",
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
