import { type RequestHandler } from "express";
import BrandModel, { type IBrand } from "../models/brand";
import createHttpError from "http-errors";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";
import ApiFeatures from "../utils/apiFeatures";

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

export const createBrand: RequestHandler = async (req, res, next) => {
  try {
    const name: string = req.body.name;
    const existingBrand = await BrandModel.findOne({ name }).exec();
    if (existingBrand) {
      throw createHttpError(409, "brand already exists");
    }
    const newBrand = await BrandModel.create({
      name,
      slug: slugify(name),
    });
    res.status(201).json({ data: newBrand });
  } catch (err) {
    next(err);
  }
};

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

export const deleteBrand: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const brand = await BrandModel.findById(id).exec();
    if (!brand) {
      throw createHttpError(404, "brand not found");
    }
    await brand.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
