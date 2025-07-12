import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  getAllUsers,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/refresh-token", refreshToken);
userRouter.post("/logout", logout);
userRouter.get("/", authenticateToken, getAllUsers);

export default userRouter;
