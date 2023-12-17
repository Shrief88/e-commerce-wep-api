import { type RequestHandler } from "express";
import createHttpError from "http-errors";
import bycrpt from "bcryptjs";
import jwt from "jsonwebtoken";

import { type CustomRequest } from "./auth";
import UserModel from "../models/user";
import env from "../config/validateEnv";

export const getLoggedUser: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    req.params.id = req.user._id;
    next();
  } catch (err) {
    next(err);
  }
};

export const changeLoggedUserPassword: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const id: string = req.user._id;
    req.body.password = await bycrpt.hash(req.body.password as string, 12);
    const user = await UserModel.findByIdAndUpdate(
      id,
      { password: req.body.password, passwordChangedAt: Date.now() },
      { new: true },
    ).exec();

    if (!user) {
      throw createHttpError(404, "user not found");
    }

    const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
      expiresIn: "90d",
    });
    res.status(200).json({ data: user, token });
  } catch (err) {
    next(err);
  }
};
