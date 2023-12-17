import * as userController from "../controllers/user";
import express from "express";
import * as userValidator from "../validators/userValidator";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";
import * as authController from "../controllers/auth";

const userRouter = express.Router();

// @access private [admin, manager]
userRouter.get(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  userController.getUsers,
);

// @access private [admin, manager]
userRouter.get(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  userValidator.getUserValidator,
  userController.getUser,
);

// @access private [admin]
userRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin"),
  uploadSingleImage("profileImage"),
  userValidator.createUserValidator,
  resizeSingleImage("user", "profileImage"),
  userController.createUser,
);

// @access private [admin]
userRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  uploadSingleImage("profileImage"),
  userValidator.updateCategoryValidator,
  resizeSingleImage("user", "profileImage"),
  userController.updateUser,
);

// @access private [admin]
userRouter.put(
  "/changePassword/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  userValidator.updateUserPasswordValidator,
  userController.changeUserPassword,
);

// @access private
userRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  userValidator.deleteCategoryValidator,
  userController.deleteUser,
);

export default userRouter;
