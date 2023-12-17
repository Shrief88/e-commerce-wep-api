import express from "express";

import * as authValidator from "../validators/authValidator";
import * as authController from "../controllers/auth";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  authValidator.signupValidator,
  authController.signup,
);

authRouter.post("/login", authValidator.loginValidator, authController.login);

authRouter.post(
  "/forgetPassword",
  authValidator.forgetPasswordValidator,
  authController.forgetPassword,
);

authRouter.post(
  "/verifyResetCode",
  authValidator.verifyResetCodeValidator,
  authController.verifyResetCode,
);

authRouter.put(
  "/resetPassword",
  authValidator.resetPasswordValidator,
  authController.resetPassword,
);

export default authRouter;
