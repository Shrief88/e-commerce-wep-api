import { type RequestHandler } from "express";
import createHttpError from "http-errors";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";

import ApiFeatures from "../utils/apiFeatures";
import BrandModel, { type IBrand } from "../models/brand";

// @desc Retrieves a list of brands from the database and sends it as a response.
// @route GET /api/v1/brand
// @access Public
export const getBrands: RequestHandler = async (req, res, next) => {
  try {
    const documentCount = await BrandModel.countDocuments();
    const apiFeatures = new ApiFeatures(BrandModel.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paggination(documentCount)
      .search();

    const { mongooseQuery, pagginationResult } = apiFeatures;
    const brands = await mongooseQuery;

    res.status(200).json({
      result: brands.length,
      pagginationResult,
      data: brands,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Retrieves a specific brand from the database and sends it as a response.
// @route GET /api/v1/brand/:id
// @access Public
export const getBrand: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const brand = await BrandModel.findById(id).exec();
    if (!brand) {
      throw createHttpError(404, "brand not found");
    }
    res.status(200).json({ data: brand });
  } catch (err) {
    next(err);
  }
};

// @desc Creates a new brand in the database
// @route POST /api/v1/brand
// @access Private [admin, manager]
export const createBrand: RequestHandler = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name as string);
    const newBrand = await BrandModel.create(req.body);
    res.status(201).json({ data: newBrand });
  } catch (err) {
    next(err);
  }
};

// @desc Updates a specific brand in the database
// @route PUT /api/v1/brand/:id
// @access Private [admin, manager]
export const updateBrand: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name as string);
    }
    const brand = await BrandModel.findByIdAndUpdate(
      id,
      req.body as UpdateQuery<IBrand>,
      { new: true },
    ).exec();

    if (!brand) {
      throw createHttpError(404, "brand not found");
    }

    res.status(200).json({ data: brand });
  } catch (err) {
    next(err);
  }
};

// @desc Deletes a specific brand from the database
// @route DELETE /api/v1/brand/:id
// @access Private [admin]
export const deleteBrand: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const brand = await BrandModel.findByIdAndDelete(id).exec();
    if (!brand) {
      throw createHttpError(404, "brand not found");
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
