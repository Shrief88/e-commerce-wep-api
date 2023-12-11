import { type NextFunction, type Response, type Request } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

const validateMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(createHttpError(400, errors.array()[0].msg as string));
  }
  next();
};

export default validateMiddleware;
