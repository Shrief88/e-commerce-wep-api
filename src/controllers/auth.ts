import { type Request, type RequestHandler } from "express";
import bycrpt from "bcryptjs";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import createHttpError from "http-errors";

import env from "../config/validateEnv";
import { UserModel, type IUser } from "../models/user";
import { sendEmail } from "../utils/sendEmail";
import createToken from "../utils/createToken";

interface jwtObject {
  user_id: string;
  iat: number;
  exp: number;
}

export interface CustomRequest extends Request {
  user: IUser;
}

// @route POST /api/v1/auth/signup
// @access Public
export const signup: RequestHandler = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name as string);
    req.body.role = "user";
    const user = await UserModel.create(req.body);
    const token = createToken({ user_id: user._id });

    res.status(201).json({ data: user, token });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/v1/auth/login
// @access Public
export const login: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (
      !user ||
      !(await bycrpt.compare(req.body.password as string, user.password))
    ) {
      throw createHttpError(404, "Invalid credantials");
    }

    const token = createToken({ user_id: user._id });
    res.status(200).json({ data: user, token });
  } catch (err) {
    next(err);
  }
};

// @desc Middleware function to protect routes.
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
        const user = await UserModel.findById((decoded as jwtObject).user_id);

        // verify if user still exists
        if (!user) {
          throw createHttpError(401, "this user no longer exists");
        }

        // check if user delete his account
        if (!user.active) {
          throw createHttpError(401, "user is not active");
        }

        // verify if password has been changed after token was issued
        if (user.passwordChangedAt) {
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

// @desc Creates a middleware function that checks if the user is allowed to access the route based on their roles.
export const allowedTo = (...roles: string[]): RequestHandler => {
  return async (req: CustomRequest, res, next) => {
    try {
      if (!roles.includes(req.user.role as unknown as string)) {
        throw createHttpError(403, "Forbidden");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

// @route POST /api/v1/auth/forgetPassword
// @access Public
export const forgetPassword: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      throw createHttpError(404, "user not found");
    }

    // Generate code and save it
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashCode = await bycrpt.hash(code, 12);
    user.passwordResetCode = hashCode;
    user.passwordResetExpires = (Date.now() +
      10 * 60 * 1000) as unknown as Date;
    user.passwordResetVerified = false;
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "password reset code, valid for 10 minutes",
        content: `Hi ${user.name},\n Your password reset code is ${code}`,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
      throw createHttpError(500, "failed to send email");
    }

    res.status(200).json({ message: "code sent to email" });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/v1/auth/verifyResetCode
// @access Public
export const verifyResetCode: RequestHandler = async (req, res, next) => {
  try {
    const hashCode = await bycrpt.hash(req.body.code as string, 12);
    const user = await UserModel.findOne({
      passwordResetCode: hashCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw createHttpError(400, "reset code is invalid or expired");
    }

    user.passwordResetVerified = true;
    await user.save();
    res.status(200).json({ message: "code verified" });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/v1/auth/resetPassword
// @access Public
export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      throw createHttpError(404, "user not found");
    }

    if (!user.passwordResetVerified) {
      throw createHttpError(400, "reset code is has not been verified");
    }

    user.password = req.body.password;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    const token = createToken({ user_id: user._id });

    res.status(200).json({
      status: "success",
      message: "password reset successfully",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
