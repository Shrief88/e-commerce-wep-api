import multer, { type Field, type FileFilterCallback } from "multer";
import createHttpError from "http-errors";
import { type RequestHandler, type Request } from "express";

const multerConfig = (): multer.Multer => {
  const storage = multer.memoryStorage();
  const multerFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(createHttpError(400, "Only image files are allowed!"));
    }
  };

  const upload = multer({ storage, fileFilter: multerFilter });
  return upload;
};

export const uploadSingleImage = (filename: string): RequestHandler => {
  return multerConfig().single(filename);
};

export const uploadMixImages = (fields: Field[]): RequestHandler => {
  return multerConfig().fields(fields);
};
