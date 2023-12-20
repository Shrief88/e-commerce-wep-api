import express from "express";

import * as authValidator from "../validators/auth";
import * as authController from "../controllers/auth";

const authRouter = express.Router();

authRouter.post("/signup", authValidator.signup, authController.signup);

authRouter.post("/login", authValidator.login, authController.login);

authRouter.post(
  "/forgetPassword",
  authValidator.forgetPassword,
  authController.forgetPassword,
);

authRouter.post(
  "/verifyResetCode",
  authValidator.verifyResetCode,
  authController.verifyResetCode,
);

authRouter.put(
  "/resetPassword",
  authValidator.resetPassword,
  authController.resetPassword,
);

export default authRouter;
