import { type RequestHandler } from "express";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";
import createHttpError from "http-errors";

import ApiFeatures from "../utils/apiFeatures";
import ProductModel, { type IProduct } from "../models/product";

// @desc Retrieves a list of products from the database and sends it as a response.
// @route GET /api/v1/product
// @access Public
export const getproducts: RequestHandler = async (req, res, next) => {
  try {
    const documentCount = await ProductModel.countDocuments();
    const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paggination(documentCount)
      .search();

    const { mongooseQuery, pagginationResult } = apiFeatures;
    const products = await mongooseQuery;

    res
      .status(200)
      .json({ result: products.length, pagginationResult, data: products });
  } catch (err) {
    next(err);
  }
};

// @desc Retrieves a specific product from the database and sends it as a response.
// @route GET /api/v1/product/:id
// @access Public
export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const product = await ProductModel.findById(id).populate("reviews");
    if (!product) {
      throw createHttpError(404, "product not found");
    }
    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
};

// @desc Creates a new product in the database
// @route POST /api/v1/product
// @access Private [admin, manager]
export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name as string);
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({ data: newProduct });
  } catch (err) {
    next(err);
  }
};

// @desc Updates a specific product in the database
// @route PUT /api/v1/product/:id
// @access Private [admin, manager]
export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name as string);
    }
    const product = await ProductModel.findByIdAndUpdate(
      id,
      req.body as UpdateQuery<IProduct>,
      { new: true },
    ).exec();

    if (!product) {
      throw createHttpError(404, "product not found");
    }

    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
};

// @desc Deletes a specific product from the database
// @route DELETE /api/v1/product/:id
// @access Private [admin]
export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
      throw createHttpError(404, "product not found");
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
