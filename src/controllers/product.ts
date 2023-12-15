import { type RequestHandler } from "express";
import ProductModel, { type IProduct } from "../models/product";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";
import ApiFeatures from "../utils/apiFeatures";
import createHttpError from "http-errors";

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

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const product = await ProductModel.findById(id).exec();
    if (!product) {
      throw createHttpError(404, "product not found");
    }
    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name as string);
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({ data: newProduct });
  } catch (err) {
    next(err);
  }
};

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

export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findByIdAndDelete(id).exec();
    if (!product) {
      throw createHttpError(404, "product not found");
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
