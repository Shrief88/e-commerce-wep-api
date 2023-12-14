import { type RequestHandler } from "express";
import SubcategoryModel, { type ISubcategory } from "../models/subcategory";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";
import ApiFeatures from "../utils/apiFeatures";

export const getSubcategories: RequestHandler = async (req, res, next) => {
  try {
    const documentCount = await SubcategoryModel.countDocuments();
    const apiFeatures = new ApiFeatures(SubcategoryModel.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paggination(documentCount)
      .search();

    const { mongooseQuery, pagginationResult } = apiFeatures;
    const subcategories = await mongooseQuery;

    res.status(200).json({
      result: subcategories.length,
      pagginationResult,
      data: subcategories,
    });
  } catch (err) {
    next(err);
  }
};

export const getSubcategory: RequestHandler = async (req, res, next) => {
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
