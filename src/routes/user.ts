import * as userController from "../controllers/user";
import express from "express";
import * as userValidator from "../validators/userValidator";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";

const userRouter = express.Router();

// @access private
userRouter.get("/", userController.getUsers);

// @access private
userRouter.get("/:id", userValidator.getUserValidator, userController.getUser);

userRouter.post(
  "/",
  uploadSingleImage("profileImage"),
  userValidator.createUserValidator,
  resizeSingleImage("user", "profileImage"),
  userController.createUser,
);

userRouter.put(
  "/:id",
  uploadSingleImage("profileImage"),
  userValidator.updateCategoryValidator,
  resizeSingleImage("user", "profileImage"),
  userController.updateUser,
);

userRouter.delete(
  "/:id",
  userValidator.deleteCategoryValidator,
  userController.deleteUser,
);

export default userRouter;
