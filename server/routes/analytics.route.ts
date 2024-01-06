import express from "express";
import { getUsersAnalytics } from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUsersAnalytics
);

export default analyticsRouter;
