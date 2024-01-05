import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrdersAdmin,
} from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);

orderRouter.get(
  "/get-all-orders-admin",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrdersAdmin
);

export default orderRouter;
