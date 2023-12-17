import { type RequestHandler, type Request } from "express";
import UserModel, { type IUser } from "../models/user";
import ApiFeatures from "../utils/apiFeatures";
import createHttpError from "http-errors";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";
import bycrpt from "bcryptjs";

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const documentCount = await UserModel.countDocuments();
    const apiFeatures = new ApiFeatures(UserModel.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paggination(documentCount)
      .search();

    const { mongooseQuery, pagginationResult } = apiFeatures;
    const users = await mongooseQuery;

    res.status(200).json({
      result: users.length,
      pagginationResult,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const user = await UserModel.findById(id).exec();
    if (!user) {
      throw createHttpError(404, "user not found");
    }
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

interface CustomRequest extends Request {
  user: IUser;
}

export const getLoggedData: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    req.params.id = req.user._id;
  } catch (err) {
    next(err);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name as string);
    req.body.role = "admin";
    const newUser = await UserModel.create(req.body);
    res.status(201).json({ data: newUser });
  } catch (err) {
    next(err);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name as string);
    }

    const { password, passwordConfirm, ...updatedFields } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      id,
      updatedFields as UpdateQuery<IUser>,
      { new: true },
    ).exec();

    if (!user) {
      throw createHttpError(404, "user not found");
    }
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

export const changeUserPassword: RequestHandler = async (req, res, next) => {
  const id: string = req.params.id;
  req.body.password = await bycrpt.hash(req.body.password as string, 12);
  const user = await UserModel.findByIdAndUpdate(
    id,
    { password: req.body.password, passwordChangedAt: Date.now() },
    { new: true },
  ).exec();
  if (!user) {
    throw createHttpError(404, "user not found");
  }
  res.status(200).json({ data: user });
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw createHttpError(404, "user not found");
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
