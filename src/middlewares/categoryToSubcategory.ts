import { type NextFunction, type Request, type Response } from "express";

export const setCategoryIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

export const setFilterObject = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = {
      category: req.params.categoryId,
    };
  }
  req.body.filterObject = filterObject;
  next();
};
