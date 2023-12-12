import { type RequestHandler } from "express";
import BrandModel, { type IBrand } from "../models/brand";
import createHttpError from "http-errors";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";

export const getBrands: RequestHandler = async (req, res, next) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const skip: number = (page - 1) * limit;
    const brands = await BrandModel.find().skip(skip).limit(limit);
    res.status(200).json({ results: brands.length, page, data: brands });
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
