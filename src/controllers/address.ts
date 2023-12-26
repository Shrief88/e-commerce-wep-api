import { type RequestHandler } from "express";
import createHttpError from "http-errors";

import { type CustomRequest } from "./auth";
import { UserModel } from "../models/user";

// @route GET /api/v1/address/
// @access Private [user]
export const getUserAddresses: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const user = await UserModel.findById(req.user._id);
    res.status(200).json({ data: user?.addresses });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/v1/address/
// @access Private [user]
export const addAddress: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { addresses: req.body.address },
      },
      { new: true },
    );
    res.status(200).json({ data: user?.addresses });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/v1/address/:id
// @access Private [user]
export const updateAddress: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const addresId = req.params.id;
    const user = await UserModel.findById(req.user._id);
    if (user && user.addresses) {
      const index = user.addresses.findIndex(
        (address) => address._id?.toString() === addresId,
      );
      if (index === -1) {
        throw createHttpError(404, "Address not found");
      }
      const address = req.body.address;
      user.addresses[index] = {
        ...user.addresses[index],
        alias: address?.alias ?? user.addresses[index].alias,
        details: address?.details ?? user.addresses[index].details,
        phone: address?.phone ?? user.addresses[index].phone,
        city: address?.city ?? user.addresses[index].city,
        postcode: address?.postcode ?? user.addresses[index].postcode,
      };

      await user.save();
    }

    res.status(200).json({ data: user?.addresses });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/v1/address/:id
// @access Private [user]
export const removeAddress: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const address = await UserModel.findByIdAndUpdate(req.user._id, {
      $pull: { addresses: { _id: req.params.id } },
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
