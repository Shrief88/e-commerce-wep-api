import { type RequestHandler } from "express";
import ProductModel, { type IProduct } from "../models/product";
import BrandModel from "../models/brand";
import CategoryModel from "../models/category";
import SubcategoryModel from "../models/subcategory";
import createHttpError from "http-errors";
import slugify from "slugify";
import { type UpdateQuery } from "mongoose";

export const getproducts: RequestHandler = async (req, res, next) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const skip: number = (page - 1) * limit;
    const products = await ProductModel.find().skip(skip).limit(limit);
    res.status(200).json({ results: products.length, page, data: products });
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
    const name: string = req.body.name;
    const category: string = req.body.category;
    const brand: string = req.body.brand;
    const subcategorories: string[] | undefined = req.body.subcategory;

    const existingCategory = await CategoryModel.findOne({
      name: category,
    }).exec();
    if (!existingCategory) {
      throw createHttpError(404, "category not found");
    }

    const existingBrand = await BrandModel.findOne({ name: brand }).exec();
    if (!existingBrand) {
      throw createHttpError(404, "brand not found");
    }

    if (subcategorories) {
      for (const subcategory of subcategorories) {
        const existingSubcategory = await SubcategoryModel.findOne({
          name: subcategory,
        }).exec();
        if (!existingSubcategory) {
          throw createHttpError(404, "subcategory not found");
        }
      }
    }

    const existingProduct = await ProductModel.findOne({ name }).exec();
    if (existingProduct) {
      throw createHttpError(409, "product already exists");
    }

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
    const category: string | undefined = req.body.category;
    const brand: string | undefined = req.body.brand;
    const subcategorories: string[] | undefined = req.body.subcategory;

    if (category) {
      const existingCategory = await CategoryModel.findOne({
        name: category,
      }).exec();
      if (!existingCategory) {
        throw createHttpError(404, "category not found");
      }
    }

    if (brand) {
      const existingBrand = await BrandModel.findOne({ name: brand }).exec();
      if (!existingBrand) {
        throw createHttpError(404, "brand not found");
      }
    }

    if (subcategorories) {
      for (const subcategory of subcategorories) {
        const existingSubcategory = await SubcategoryModel.findOne({
          name: subcategory,
        }).exec();
        if (!existingSubcategory) {
          throw createHttpError(404, "subcategory not found");
        }
      }
    }

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
    const product = await BrandModel.findById(id).exec();
    if (!product) {
      throw createHttpError(404, "product not found");
    }
    await product.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
