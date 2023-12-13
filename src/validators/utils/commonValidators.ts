import { body } from "express-validator";

export const commonCategoryValidationRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
];

export const commonSubcategoryValidationRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  body("category").isMongoId().withMessage("Invalid category ID"),
];

export const commonBrandValidationRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
];

export const commonProductValidationRules = [
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long"),
  body("description")
    .isString()
    .withMessage("description must be a string")
    .trim()
    .isLength({ min: 20 })
    .withMessage("description must be at least 20 characters long")
    .isLength({ max: 200 })
    .withMessage("description must be at most 500 characters long"),
  body("sold").isNumeric().withMessage("sold must be a number"),
  body("quantity").isNumeric().withMessage("quantity must be a number"),
  body("price").isNumeric().withMessage("price must be a number"),
  body("priceAfterDiscount")
    .isNumeric()
    .withMessage("priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (value < req.body.price) {
        throw new Error("priceAfterDiscount must be greater than price");
      }
      return true;
    }),
  body("colors").isArray().withMessage("colors must be an array"),
  body("imageCover").isString().withMessage("imageCover must be a string"),
  body("images").isArray().withMessage("images must be an array"),
  body("category").isMongoId().withMessage("Invalid category ID"),
  body("subcategory")
    .isArray()
    .withMessage("subcategory must be an array")
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
];
