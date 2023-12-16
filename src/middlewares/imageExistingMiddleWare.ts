import { type RequestHandler } from "express";
import createHttpError from "http-errors";

const validateImageExisting: RequestHandler = async (req, res, next) => {
  if (!req.file && !req.files) {
    next(createHttpError(400, "image is required!"));
  }
  if (req.files) {
    if (!("imageCover" in req.files)) {
      next(createHttpError(400, "imageCover is required!"));
    }
  }
  next();
};

export default validateImageExisting;
