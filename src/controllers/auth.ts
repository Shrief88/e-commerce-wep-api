import { type Request, type RequestHandler } from "express";
import userModel from "../models/user";
import jwt from "jsonwebtoken";
import env from "../config/validateEnv";
import bycrpt from "bcryptjs";
import createHttpError from "http-errors";
import slugify from "slugify";
import { type IUser } from "../models/user";

export const signup: RequestHandler = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name as string);
    const user = await userModel.create(req.body);
    const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
      expiresIn: "90d",
    });

    res.status(201).json({ data: user, token });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (
      !user ||
      !(await bycrpt.compare(req.body.password as string, user.password))
    ) {
      throw createHttpError(404, "Invalid credantials");
    }

    const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
      expiresIn: "90d",
    });

    res.status(200).json({ data: user, token });
  } catch (err) {
    next(err);
  }
};

interface jwtObject {
  user_id: string;
  iat: number;
  exp: number;
}

interface CustomRequest extends Request {
  user: IUser;
}

export const protectRoute: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    let token = "";
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const user = await userModel.findById((decoded as jwtObject).user_id);

        // verify if user still exists
        if (!user) {
          throw createHttpError(401, "this user no longer exists");
        }
        // verify if password has been changed after token was issued
        if (user.passwordChangedAt) {
          console.log(user.passwordChangedAt);
          const changedTimestamp = Math.floor(
            user.passwordChangedAt.getTime() / 1000,
          );
          if (changedTimestamp > (decoded as jwtObject).iat) {
            throw createHttpError(
              401,
              "user recently changed password, please login again",
            );
          }
        }
        req.user = user;
      }
      next();
    }
    if (!token) {
      throw createHttpError(401, "Unauthorized, please login");
    }
  } catch (err) {
    next(err);
  }
};
