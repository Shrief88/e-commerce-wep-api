import { type RequestHandler } from "express";
import SubcategoryModel from "../models/subcategory";
import CategoryModel from "../models/category";
import createHttpError from "http-errors";
import slugify from "slugify";
import { type ObjectId } from "mongoose";

export const getSubcategories: RequestHandler = async (req, res, next) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const skip: number = (page - 1) * limit;
    const filterObject: Record<string, ObjectId> = req.body.filterObject;

    const subCategories = await SubcategoryModel.find(filterObject)
      .skip(skip)
      .limit(limit)
      .populate({ path: "category", select: "name" })
      .exec();
    res
      .status(200)
      .json({ results: subCategories.length, page, data: subCategories });
  } catch (err) {
    next(err);
  }
};

export const getsubcategory: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const subcategory = await SubcategoryModel.findById(id)
      .populate({ path: "category", select: "name" })
      .exec();
    if (!subcategory) {
      throw createHttpError(404, "subcategory not found");
    }
    res.status(200).json({ data: subcategory });
  } catch (err) {
    next(err);
  }
};

export const createsubcategory: RequestHandler = async (req, res, next) => {
  try {
    const name: string = req.body.name;
    const category: string = req.body.category;

    const existingCategory = await CategoryModel.findById(category).exec();
    if (!existingCategory) {
      throw createHttpError(404, "category not found");
    }

    const existingsubcategory = await SubcategoryModel.findOne({ name }).exec();
    if (existingsubcategory) {
      throw createHttpError(409, "subcategory already exists");
    }
    const newsubcategory = await SubcategoryModel.create({
      name,
      slug: slugify(name),
      category,
    });
    res.status(201).json({ data: newsubcategory });
  } catch (err) {
    next(err);
  }
};

export const updatesubcategory: RequestHandler = async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const subcategory = await SubcategoryModel.findById(id).exec();
    if (!subcategory) {
      throw createHttpError(404, "subcategory not found");
    }
    const name: string | undefined = req.body.name;
    const category: string | undefined = req.body.category;
    if (name) {
      subcategory.name = name;
      subcategory.slug = slugify(name);
    }
    if (category) {
      const existingCategory = await CategoryModel.findById(category).exec();
      if (!existingCategory) {
        throw createHttpError(404, "category not found");
      }
      subcategory.category = category;
    }
    const updatedsubcategory = await subcategory.save();
    res.status(200).json({ data: updatedsubcategory });
  } catch (err) {
    next(err);
  }
};

export const deletesubcategory: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const subcategory = await SubcategoryModel.findById(id).exec();
    if (!subcategory) {
      throw createHttpError(404, "subcategory not found");
    }
    await subcategory.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
