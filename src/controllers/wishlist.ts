import { type RequestHandler } from "express";

import { type CustomRequest } from "./auth";
import { UserModel } from "../models/user";

export const addToWishlist: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { wishlist: req.body.product },
      },
      { new: true },
    );

    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

export const removeFromWishlist: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    await UserModel.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: req.params.product },
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const getUserWishlist: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userWishlist = await UserModel.findById(req.user._id).populate({
      path: "wishlist",
      select: "name",
    });
    res.status(200).json({ data: userWishlist?.wishlist });
  } catch (err) {
    next(err);
  }
};
