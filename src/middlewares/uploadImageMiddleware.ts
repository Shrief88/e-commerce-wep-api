import multer, { type FileFilterCallback } from "multer";
import createHttpError from "http-errors";
import { type Request } from "express";

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

export const uploadSingleImage = upload.single("image");
