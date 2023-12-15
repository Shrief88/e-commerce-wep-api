import { type RequestHandler } from "express";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export const resizeImage: RequestHandler = async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}`;
  try {
    await sharp(req.file?.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .toFile(`uploads/categories/${filename}.jpeg`);

    req.body.image = filename;
  } catch (err) {
    next(err);
  }
  next();
};
