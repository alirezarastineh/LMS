import express from "express";
import {
  activateUser,
  getAllUsersAdmin,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateUserAvatar,
  updateUserInfo,
  updateUserPassword,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.get("/refresh", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);

userRouter.put("/update-user-password", isAuthenticated, updateUserPassword);

userRouter.put("/update-user-avatar", isAuthenticated, updateUserAvatar);

userRouter.get(
  "/get-all-users-admin",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsersAdmin
);

export default userRouter;
