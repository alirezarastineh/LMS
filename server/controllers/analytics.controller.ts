import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler, { getErrorMessage } from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

export const getUsersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(UserModel);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

export const getCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MonthsData(CourseModel);

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

export const getOrdersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(OrderModel);

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);
