import express from "express";
import { isAuthenticated, login, login_verifyOtp, logout, register, resetPassword, sendResetOtp, verifyOtp } from "../controllers/authController.js";
import userAuth from "../middleWare/userAuth.js";
const authRouter = express.Router()

authRouter.post("/signup", register);
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.post("/send-verify-otp",userAuth,verifyOtp );
authRouter.post("/verify-account", userAuth, login_verifyOtp);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);





export default authRouter

