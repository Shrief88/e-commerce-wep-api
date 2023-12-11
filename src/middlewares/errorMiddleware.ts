import { type NextFunction, type Request, type Response } from "express";
import { isHttpError } from "http-errors";
import env from "../utils/validateEnv";

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  let stack: string | undefined = "";
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
    stack = error.stack;
  }

  if (env.NODE_ENV === "production") {
    res.status(statusCode).json({ message: errorMessage });
  }

  if (env.NODE_ENV === "development") {
    res.status(statusCode).json({ message: errorMessage, stack });
  }
};

export default errorMiddleware;
