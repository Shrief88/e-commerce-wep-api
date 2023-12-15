import { type RequestHandler } from "express";
import SubcategoryModel, { type ISubcategory } from "../models/subcategory";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";
import ApiFeatures from "../utils/apiFeatures";
import createHttpError from "http-errors";

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
    const subcategory = await SubcategoryModel.findById(id).exec();
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
    req.body.slug = slugify(req.body.name as string);
    const newsubcategory = await SubcategoryModel.create(req.body);
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

    if (!subcategory) {
      throw createHttpError(404, "subcategory not found");
    }
    res.status(200).json({ data: subcategory });
  } catch (err) {
    next(err);
  }
};

export const deletesubcategory: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const subcategory = await SubcategoryModel.findByIdAndDelete(id).exec();
    if (!subcategory) {
      throw createHttpError(404, "subcategory not found");
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
