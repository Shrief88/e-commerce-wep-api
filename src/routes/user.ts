import express, {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";

import * as userValidator from "../validators/user";
import * as authController from "../controllers/auth";
import * as userController from "../controllers/user";
import * as loggedUserController from "../controllers/loggedUser";
import { login as loginValidator } from "../validators/auth";
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
  userValidator.updateLoggedUserPassword,
  loggedUserController.changeLoggedUserPassword,
);

userRouter.put(
  "/updateMe",
  authController.protectRoute,
  uploadSingleImage("profileImage"),
  userValidator.updateLoggedUser,
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

// Admin and Manager ///////////////////////////////
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
  userValidator.getUser,
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

// Admin Only //////////////////////////////////////
userRouter.post(
  "/",
  conditionalMiddleware(authController.protectRoute),
  conditionalMiddleware(authController.allowedTo("admin")),
  uploadSingleImage("profileImage"),
  userValidator.createUser,
  resizeSingleImage("user", "profileImage"),
  userController.createUser,
);

userRouter.use(authController.protectRoute, authController.allowedTo("admin"));
userRouter.put(
  "/:id",
  uploadSingleImage("profileImage"),
  userValidator.updateUser,
  resizeSingleImage("user", "profileImage"),
  userController.updateUser,
);

userRouter.put(
  "/changePassword/:id",
  userValidator.updateUserPassword,
  userController.changeUserPassword,
);

userRouter.delete("/:id", userValidator.deleteUser, userController.deleteUser);

export default userRouter;
