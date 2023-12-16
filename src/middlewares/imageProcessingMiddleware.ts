import { type RequestHandler } from "express";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export const resizeSingleImage = (
  modelName: string,
  path: string,
): RequestHandler => {
  return async (req, res, next) => {
    if (req.file) {
      const filename = `${modelName}-${uuidv4()}-${Date.now()}.jpeg`;
      try {
        await sharp(req.file?.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .toFile(`uploads/${modelName}/${filename}`);

        req.body[path] = filename;
      } catch (err) {
        next(err);
      }
    }
    next();
  };
};

export const resizeMixImage = (modelName: string): RequestHandler => {
  return async (req, res, next) => {
    if (req.files) {
      if ("imageCover" in req.files) {
        const filename = `${modelName}-${uuidv4()}-${Date.now()}-cover.jpeg`;
        try {
          await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .toFile(`uploads/${modelName}/${filename}`);

          req.body.imageCover = filename;
        } catch (err) {
          next(err);
        }
      }

      if ("images" in req.files) {
        req.body.images = [];
        await Promise.all(
          req.files.images.map(async (img, index) => {
            const imageName = `${modelName}-${uuidv4()}-${Date.now()}-${
              index + 1
            }.jpeg`;
            await sharp(img.buffer)
              .resize(600, 600)
              .toFormat("jpeg")
              .toFile(`uploads/${modelName}/${imageName}`);
            req.body.images.push(imageName);
          }),
        );
      }
    }

    next();
  };
};
