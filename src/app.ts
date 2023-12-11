import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import env from "./utils/validateEnv";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";

const app = express();

// MIDDLEWARE
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ message: errorMessage });
});

export default app;
