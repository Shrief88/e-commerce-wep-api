import { type RequestHandler } from "express";
import createHttpError from "http-errors";
import { type UpdateQuery } from "mongoose";

import ApiFeatures from "../utils/apiFeatures";
import { CouponModel, type ICoupon } from "../models/coupon";

// @route GET /api/v1/coupon
// @access Private [admin, manager]
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

// @route GET /api/v1/coupon/:id
// @access Private [admin, manager]
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

// @route PUT /api/v1/coupon/:id
// @access Private [admin, manager]
export const updateCoupon: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const coupon = await CouponModel.findByIdAndUpdate(
      id,
      req.body as UpdateQuery<ICoupon>,
      {
        new: true,
      },
    );
    res.status(200).json({ data: coupon });
  } catch (err) {
    next(err);
  }
};
// @route DELETE /api/v1/coupon/:id
// @access Private [admin, manager]
export const deleteCoupon: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const coupon = await CouponModel.findByIdAndDelete(id);
    if (!coupon) {
      throw createHttpError(404, "coupon not found");
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
