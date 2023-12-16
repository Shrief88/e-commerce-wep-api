import { body } from "express-validator";
import BrandModel from "../../models/brand";
import CategoryModel from "../../models/category";
import SubcategoryModel from "../../models/subcategory";
import ProductModel from "../../models/product";
import UserModel from "../../models/user";

export const bodyCategoryRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long")
    .custom(async (name: string) => {
      if (await CategoryModel.findOne({ name }).exec()) {
        throw new Error("category already exists");
      }
      return true;
    }),
];

export const bodySubcategoryRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  body("category").isMongoId().withMessage("category is invalid"),
  body("name").custom(async (name: string) => {
    if (await SubcategoryModel.findOne({ name }).exec()) {
      throw new Error("subcategory already exists");
    }
    return true;
  }),
  body("category").custom(async (category: string) => {
    if (!(await CategoryModel.findById(category).exec())) {
      throw new Error("category does not exist");
    }
    return true;
  }),
];

export const bodyBrandRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long")
    .custom(async (name: string) => {
      if (await BrandModel.findOne({ name }).exec()) {
        throw new Error("brand already exists");
      }
      return true;
    }),
];

export const bodyProductRules = [
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
    if (await ProductModel.findOne({ name }).exec()) {
      throw new Error("category already exists");
    }
    return true;
  }),
  body("brand").custom(async (id: string) => {
    if (!(await BrandModel.findById(id).exec())) {
      throw new Error("Invalid brand ID");
    }
    return true;
  }),
  body("category").custom(async (id: string) => {
    if (!(await CategoryModel.findById(id).exec())) {
      throw new Error("Invalid category ID");
    }
    return true;
  }),
  body("subcategories")
    .custom(async (subcategoriesID: string[]) => {
      const subcategories = await SubcategoryModel.find({
        _id: { $exists: true, $in: subcategoriesID },
      });
      if (subcategories.length !== subcategoriesID.length) {
        throw new Error("Invalid subcategory ID");
      }
      return true;
    })
    .custom(async (subcategories: string[], { req }) => {
      const categorySubs = await SubcategoryModel.find({
        category: req.body.category,
      }).exec();
      const categorySubsId: string[] = [];
      categorySubs.forEach((categorySub) => {
        categorySubsId.push(categorySub._id.toString() as string);
      });
      const checker = subcategories.every((subcategory) => {
        categorySubsId.includes(subcategory);
      });
      if (!checker) {
        throw new Error("subcategories not belong to category");
      }
      return true;
    }),
];

export const bodyUserRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("phone").trim().isMobilePhone("ar-EG").withMessage("Invalid phone"),
  body("password")
    .isString()
    .withMessage("Must Contain letters")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Too short password"),
  body("address").isString().withMessage("address must be a string"),
  body("email").custom(async (email: string) => {
    if (await UserModel.findOne({ email }).exec()) {
      throw new Error("user email already exists");
    }
    return true;
  }),
  body("phone").custom(async (phone: string) => {
    if (await UserModel.findOne({ phone }).exec()) {
      throw new Error("user phone already exists");
    }
    return true;
  }),
];
