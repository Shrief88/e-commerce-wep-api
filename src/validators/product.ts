import { body, param } from "express-validator";

import { ProductModel } from "../models/product";
import { CategoryModel } from "../models/category";
import { BrandModel } from "../models/brand";
import { SubcategoryModel } from "../models/subcategory";
import validateMiddleware from "../middlewares/validatorMiddleware";

const bodyRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 100 })
    .withMessage("name must be at most 100 characters long"),
  body("description")
    .isString()
    .withMessage("description must be a string")
    .trim()
    .isLength({ min: 20 })
    .withMessage("description must be at least 20 characters long")
    .isLength({ max: 2000 })
    .withMessage("description must be at most 2000 characters long"),
  body("sold").isNumeric().withMessage("sold must be a number"),
  body("quantity").isNumeric().withMessage("quantity must be a number"),
  body("price").isNumeric().withMessage("price must be a number"),
  body("priceAfterDiscount")
    .isNumeric()
    .withMessage("priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  body("colors").isArray().withMessage("colors must be an array"),
  body("sizes").isArray().withMessage("sizes must be an array"),
  body("category").isMongoId().withMessage("Invalid category ID"),
  body("subcategories")
    .isArray()
    .withMessage("subcategories must be an array")
    .isMongoId()
    .withMessage("Invalid subcategory ID"),
  body("brand").isMongoId().withMessage("Invalid brand ID"),
  body("ratingsAverage")
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .custom((value) => {
      if (value < 1 || value > 5) {
        throw new Error("ratingsAverage must be between 1 and 5");
      }
      return true;
    }),
  body("ratingsQuantity")
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  body("name").custom(async (name: string) => {
    if (await ProductModel.findOne({ name })) {
      throw new Error("category already exists");
    }
    return true;
  }),
  body("brand").custom(async (id: string) => {
    if (!(await BrandModel.findById(id))) {
      throw new Error("Invalid brand ID");
    }
    return true;
  }),
  body("category").custom(async (id: string) => {
    if (!(await CategoryModel.findById(id))) {
      throw new Error("Invalid category ID");
    }
    return true;
  }),
  body("subcategories").custom(async (subcategoriesID: string[], { req }) => {
    const subcategories = await SubcategoryModel.find({
      _id: { $exists: true, $in: subcategoriesID },
    });
    if (subcategories.length !== subcategoriesID.length) {
      throw new Error("Invalid subcategory ID");
    }

    const checker = subcategories.every((subcategory) => {
      const { _id } = subcategory.category as unknown as { _id: string };
      return _id.toString() === req.body.category;
    });

    if (!checker) {
      throw new Error("subcategories not belong to category");
    }
    return true;
  }),
];

export const getProduct = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];

export const createProduct = [
  body("name").notEmpty().withMessage("name is required"),
  body("description").notEmpty().withMessage("description is required"),
  body("sold").optional(),
  body("quantity").notEmpty().withMessage("quantity is required"),
  body("price").notEmpty().withMessage("price is required"),
  body("priceAfterDiscount").optional(),
  body("colors").optional(),
  body("sizes").optional(),
  body("category").notEmpty().withMessage("category is required"),
  body("subcategories").optional(),
  body("brand").notEmpty().withMessage("brand is required"),
  body("ratingsAverage").optional(),
  body("ratingsQuantity").optional(),
  ...bodyRules,
  validateMiddleware,
];

export const updateProduct = [
  param("id").isMongoId().withMessage("Invalid ID"),
  ...bodyRules.map((rule) => rule.optional()),
  validateMiddleware,
];

export const deleteProduct = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validateMiddleware,
];
