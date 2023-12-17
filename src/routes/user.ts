import express from "express";

import * as userValidator from "../validators/userValidator";
import * as authController from "../controllers/auth";
import * as userController from "../controllers/user";
import * as loggedUserController from "../controllers/loggedUser";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";

const userRouter = express.Router();

// loggedIn user
userRouter.get(
  "/me",
  authController.protectRoute,
  loggedUserController.getLoggedUser,
  userController.getUser,
);

userRouter.put(
  "/changeMyPassword",
  authController.protectRoute,
  userValidator.updateUserPasswordValidator,
  loggedUserController.changeLoggedUserPassword,
);

// Admin and Manager
userRouter.get(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  userController.getUsers,
);

userRouter.get(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin", "manager"),
  userValidator.getUserValidator,
  userController.getUser,
);

// Admin Only
userRouter.post(
  "/",
  authController.protectRoute,
  authController.allowedTo("admin"),
  uploadSingleImage("profileImage"),
  userValidator.createUserValidator,
  resizeSingleImage("user", "profileImage"),
  userController.createUser,
);

userRouter.put(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  uploadSingleImage("profileImage"),
  userValidator.updateCategoryValidator,
  resizeSingleImage("user", "profileImage"),
  userController.updateUser,
);

userRouter.put(
  "/changePassword/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  userValidator.updateUserPasswordValidator,
  userController.changeUserPassword,
);

userRouter.delete(
  "/:id",
  authController.protectRoute,
  authController.allowedTo("admin"),
  userValidator.deleteCategoryValidator,
  userController.deleteUser,
);

export default userRouter;
