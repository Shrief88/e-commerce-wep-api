import { type RequestHandler } from "express";
import ProductModel, { type IProduct } from "../models/product";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";

export const getproducts: RequestHandler = async (req, res, next) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const skip: number = (page - 1) * limit;
    const products = await ProductModel.find()
      .skip(skip)
      .limit(limit)
      .populate([
        { path: "category", select: "name" },
        { path: "brand", select: "name" },
      ])
      .exec();
    res.status(200).json({ results: products.length, page, data: products });
  } catch (err) {
    next(err);
  }
};

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const product = await ProductModel.findById(id)
      .populate([
        { path: "category", select: "name" },
        { path: "brand", select: "name" },
      ])
      .exec();
    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name as string);
    console.log(req.body);
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

    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    await ProductModel.findByIdAndDelete(id).exec();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
