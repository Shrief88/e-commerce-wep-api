import { type RequestHandler } from "express";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";
import createHttpError from "http-errors";

import ApiFeatures from "../utils/apiFeatures";
import { CategoryModel, type ICategory } from "../models/category";

// @desc Retrieves a list of categories from the database and sends it as a response.
// @route GET /api/v1/category
// @access Public
export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const documentCount = await CategoryModel.countDocuments();
    const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paggination(documentCount)
      .search();

    const { mongooseQuery, pagginationResult } = apiFeatures;
    const categories = await mongooseQuery;

    res.status(200).json({
      result: categories.length,
      pagginationResult,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Retrieves a specific category from the database and sends it as a response.
// @route GET /api/v1/category/:id
// @access Public
export const getCategory: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw createHttpError(404, "category not found");
    }
    res.status(200).json({ data: category });
  } catch (err) {
    next(err);
  }
};

// @desc Creates a new category in the database
// @route POST /api/v1/category
// @access Private [admin, manager]
export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name as string);
    const newCategory = await CategoryModel.create(req.body);
    res.status(201).json({ data: newCategory });
  } catch (err) {
    next(err);
  }
};

// @desc Updates a specific category in the database
// @route PUT /api/v1/category/:id
// @access Private [admin, manager]
export const updateCategory: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name as string);
    }
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      req.body as UpdateQuery<ICategory>,
      { new: true },
    );

    if (!category) {
      throw createHttpError(404, "category not found");
    }
    res.status(200).json({ data: category });
  } catch (err) {
    next(err);
  }
};

// @desc Deletes a specific category from the database
// @route DELETE /api/v1/category/:id
// @access Private [admin]
export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      throw createHttpError(404, "category not found");
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
