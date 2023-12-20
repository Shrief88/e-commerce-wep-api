import { type RequestHandler } from "express";
import createHttpError from "http-errors";
import { type UpdateQuery } from "mongoose";

import ApiFeatures from "../utils/apiFeatures";
import { CouponModel, type ICoupon } from "../models/coupon";

// @desc Retrieves a list of coupons from the database and sends it as a response.
// @route GET /api/v1/coupon
// @access Public
export const getCoupons: RequestHandler = async (req, res, next) => {
  try {
    const documentCount = await CouponModel.countDocuments();
    const apiFeatures = new ApiFeatures(CouponModel.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paggination(documentCount)
      .search();

    const { mongooseQuery, pagginationResult } = apiFeatures;
    const coupons = await mongooseQuery;

    res.status(200).json({
      result: coupons.length,
      pagginationResult,
      data: coupons,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Retrieves a specific coupon from the database and sends it as a response.
// @route GET /api/v1/coupon/:id
// @access Public
export const getCoupon: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const coupon = await CouponModel.findById(id);
    if (!coupon) {
      throw createHttpError(404, "coupon not found");
    }
    res.status(200).json({ data: coupon });
  } catch (err) {
    next(err);
  }
};

// @desc Creates a new coupon in the database
// @route POST /api/v1/coupon
// @access Private [admin, manager]
export const createCoupon: RequestHandler = async (req, res, next) => {
  try {
    const newCoupon = await CouponModel.create(req.body);
    res.status(201).json({ data: newCoupon });
  } catch (err) {
    next(err);
  }
};

// @desc Updates a specific coupon in the database
// @route PUT /api/v1/coupon/:id
// @access Private [admin, manager]
export const updateCoupon: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const coupon = await CouponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ data: coupon });
  } catch (err) {
    next(err);
  }
};
// @desc Deletes a specific coupon from the database
// @route DELETE /api/v1/coupon/:id
// @access Private [admin]
export const deleteBrand: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const coupon = await BrandModel.findByIdAndDelete(id).exec();
    if (!coupon) {
      throw createHttpError(404, "coupon not found");
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
