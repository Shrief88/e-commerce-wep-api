import { type RequestHandler } from "express";

import { type CustomRequest } from "./auth";
import UserModel, { type Address } from "../models/user";

export const addAddress: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const address: Address = {
    alias: req.body.alias,
    details: req.body.details,
    phone: req.body.phone,
    city: req.body.city,
    postcode: req.body.postcode,
  };
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: address },
    },
    { new: true },
  );

  res.status(200).json({ data: user?.addresses });
};

export const removeAddress: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  await UserModel.findByIdAndUpdate(req.user._id, {
    $pull: { addresses: { _id: req.params.address } },
  });

  res.sendStatus(204);
};

export const updateAddress: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const address: Address = req.body as Address;
  console.log(address);
  const addressId = req.params.address;
  const user = await UserModel.findById(req.user._id);
  await user?.updateOne({ $set: { [`addresses.${addressId}`]: address } });

  res.status(200).json({ data: user?.addresses });
};

export const getUserAddresses: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const user = await UserModel.findById(req.user._id);
  res.status(200).json({ data: user?.addresses });
};
