import express from "express";
import {
  activateUser,
  deleteUser,
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
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", updateAccessToken, isAuthenticated, logoutUser);

userRouter.get("/refresh", updateAccessToken);

userRouter.get("/me", updateAccessToken, isAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put(
  "/update-user-info",
  updateAccessToken,
  isAuthenticated,
  updateUserInfo
);

userRouter.put(
  "/update-user-password",
  updateAccessToken,
  isAuthenticated,
  updateUserPassword
);

userRouter.put(
  "/update-user-avatar",
  updateAccessToken,
  isAuthenticated,
  updateUserAvatar
);

userRouter.get(
  "/get-all-users-admin",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsersAdmin
);

userRouter.put(
  "/update-user-role-admin",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/delete-user/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
