import { type RequestHandler } from "express";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export const resizeImage = (modelName: string): RequestHandler => {
  return async (req, res, next) => {
    const filename = `${modelName}-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      try {
        await sharp(req.file?.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .toFile(`uploads/${modelName}/${filename}`);

        req.body.image = filename;
      } catch (err) {
        console.log(err);
        next(err);
      }
    }

    next();
  };
};
