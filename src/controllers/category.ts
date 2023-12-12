import { type RequestHandler } from "express";
import CategoryModel, { type ICategory } from "../models/category";
import createHttpError from "http-errors";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";

export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const skip: number = (page - 1) * limit;
    const categories = await CategoryModel.find().skip(skip).limit(limit);
    res
      .status(200)
      .json({ results: categories.length, page, data: categories });
  } catch (err) {
    next(err);
  }
};

export const getCategory: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const category = await CategoryModel.findById(id).exec();
    if (!category) {
      throw createHttpError(404, "category not found");
    }
    res.status(200).json({ data: category });
  } catch (err) {
    next(err);
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const name: string = req.body.name;
    const existingCategory = await CategoryModel.findOne({ name }).exec();
    if (existingCategory) {
      throw createHttpError(409, "category already exists");
    }
    const newCategory = await CategoryModel.create({
      name,
      slug: slugify(name),
    });
    res.status(201).json({ data: newCategory });
  } catch (err) {
    next(err);
  }
};

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
    ).exec();

    if (!category) {
      throw createHttpError(404, "category not found");
    }

    res.status(200).json({ data: category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await CategoryModel.findById(id).exec();
    if (!category) {
      throw createHttpError(404, "category not found");
    }
    await category.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
