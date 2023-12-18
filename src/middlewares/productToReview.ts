import { type NextFunction, type Request, type Response } from "express";

export const setProductIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  next();
};

export const setFilterObject = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = {
      product: req.params.productId,
    };
  }
  req.body.filterObject = filterObject;
  next();
};
