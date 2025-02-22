import express from "express";
import userAuth from "../middleWare/userAuth.js";
import { getUsersData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUsersData);

export default userRouter;