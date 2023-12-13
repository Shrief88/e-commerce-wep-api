import { type ValidationChain, param, check } from "express-validator";
import type mongoose from "mongoose";

export const validIdRule = (message: string): ValidationChain[] => [
  param("id").isMongoId().withMessage(message),
];

export const existingIdRule = (
  model: mongoose.Model<any>,
  message: string,
): ValidationChain[] => [
  check("id").custom(async (id) => {
    const category = await model.findById(id).exec();
    if (!category) {
      throw new Error(message);
    }
    return true;
  }),
];
