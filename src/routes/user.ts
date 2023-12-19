import express, {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";

import * as userValidator from "../validators/userValidator";
import * as authController from "../controllers/auth";
import * as userController from "../controllers/user";
import * as loggedUserController from "../controllers/loggedUser";
import { loginValidator } from "../validators/authValidator";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import { resizeSingleImage } from "../middlewares/imageProcessingMiddleware";
import env from "../config/validateEnv";

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
  userValidator.updateLoggedUserPasswordValidator,
  loggedUserController.changeLoggedUserPassword,
);

userRouter.put(
  "/updateMe",
  authController.protectRoute,
  uploadSingleImage("profileImage"),
  userValidator.updateLoggedUserValidator,
  resizeSingleImage("user", "profileImage"),
  loggedUserController.updateLoggedUser,
);

userRouter.delete(
  "/deleteMe",
  authController.protectRoute,
  loggedUserController.deleteLoggedUser,
);

userRouter.put(
  "/activeMe",
  loginValidator,
  loggedUserController.activeLoggedUser,
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

// To allow creating users while testing
const conditionalMiddleware = (middleware: RequestHandler): RequestHandler => {
  return env.NODE_ENV !== "test"
    ? middleware
    : (req: Request, res: Response, next: NextFunction) => {
        next();
      };
};

// Admin Only
userRouter.post(
  "/",
  conditionalMiddleware(authController.protectRoute),
  conditionalMiddleware(authController.allowedTo("admin")),
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
  userValidator.updateUserValidator,
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
  userValidator.deleteUserValidator,
  userController.deleteUser,
);

export default userRouter;
