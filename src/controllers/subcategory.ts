import { type RequestHandler } from "express";
import SubcategoryModel, { type ISubcategory } from "../models/subcategory";
import slugify from "slugify";
import { type UpdateQuery, type ObjectId } from "mongoose";

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
    res.status(200).json({ data: subcategory });
  } catch (err) {
    next(err);
  }
};

export const createsubcategory: RequestHandler = async (req, res, next) => {
  try {
    const name: string = req.body.name;
    const category: string = req.body.category;
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
    if (req.body.name) {
      req.body.slug = slugify(req.body.name as string);
    }

    const subcategory = await SubcategoryModel.findByIdAndUpdate(
      id,
      req.body as UpdateQuery<ISubcategory>,
      { new: true },
    ).exec();
    res.status(200).json({ data: subcategory });
  } catch (err) {
    next(err);
  }
};

export const deletesubcategory: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    await SubcategoryModel.findByIdAndDelete(id).exec();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
