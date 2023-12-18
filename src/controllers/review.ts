import { type RequestHandler } from "express";
import createHttpError from "http-errors";

import ApiFeatures from "../utils/apiFeatures";
import ReviewModel from "../models/review";

// @desc Retrieves a list of reviews from the database and sends it as a response.
// @route GET /api/v1/review
// @access Public
export const getReviews: RequestHandler = async (req, res, next) => {
  try {
    const documentCount = await ReviewModel.countDocuments();
    const apiFeatures = new ApiFeatures(ReviewModel.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paggination(documentCount)
      .search();

    const { mongooseQuery, pagginationResult } = apiFeatures;
    const reviews = await mongooseQuery;

    res.status(200).json({
      result: reviews.length,
      pagginationResult,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Retrieves a specific review from the database and sends it as a response.
// @route GET /api/v1/review/:id
// @access Public
export const getReview: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const review = await ReviewModel.findById(id);
    if (!review) {
      throw createHttpError(404, "review not found");
    }
    res.status(200).json({ data: review });
  } catch (err) {
    next(err);
  }
};

// @desc Creates a new category in the database
// @route POST /api/v1/review
// @access Private
export const createReview: RequestHandler = async (req, res, next) => {
  try {
    const newReview = await ReviewModel.create(req.body);
    res.status(201).json({ data: newReview });
  } catch (err) {
    next(err);
  }
};

// @desc Updates a specific category in the database
// @route PUT /api/v1/review/:id
// @access Private
export const updateReview: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const review = await ReviewModel.findByIdAndUpdate(
      id,
      { titel: req.body.titel, rating: req.body.rating },
      { new: true },
    ).exec();

    if (!review) {
      throw createHttpError(404, "Review not found");
    }
    res.status(200).json({ data: review });
  } catch (err) {
    next(err);
  }
};

// @desc Deletes a specific category from the database
// @route DELETE /api/v1/review/:id
// @access Private
export const deleteReview: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const review = await ReviewModel.findByIdAndDelete(id).exec();
    if (!review) {
      throw createHttpError(404, "review not found");
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
