import { type RequestHandler } from "express";
import CategoryModel from "../models/category";
import createHttpError from "http-errors";
import slugify from "slugify";
import mongoose from "mongoose";

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
    const id: string | undefined = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid ID");
    }

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
    const name: string | undefined = req.body.name?.trim();
    if (!name) {
      throw createHttpError(400, "name is required");
    }

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
    const id: string | undefined = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid ID");
    }

    const category = await CategoryModel.findById(id).exec();
    if (!category) {
      throw createHttpError(404, "category not found");
    }

    const name: string | undefined = req.body.name?.trim();
    const slug: string | undefined = req.body.slug?.trim();

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }

    if (slug) {
      category.slug = slugify(slug);
    }

    const updatedCategory = await category.save();
    res.status(200).json({ data: updatedCategory });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid ID");
    }
    const note = await CategoryModel.findById(id).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    await note.deleteOne();

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
