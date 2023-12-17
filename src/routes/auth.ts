import * as authController from "../controllers/auth";
import express from "express";
import * as authValidator from "../validators/authValidator";

const authRouter = express.Router();

// @access public
authRouter.post(
  "/signup",
  authValidator.signupValidator,
  authController.signup,
);

// @access public
authRouter.post("/login", authValidator.loginValidator, authController.login);

// @access public
authRouter.post(
  "/forgetPassword",
  authValidator.forgetPasswordValidator,
  authController.forgetPassword,
);

// @access public
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
