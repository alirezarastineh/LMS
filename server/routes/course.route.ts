import express from "express";
import {
  editCourse,
  getAllCourses,
  getCourseContentByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const courseRouter = express.Router();

courseRouter.post(
  "/upload-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-single-course/:id", getSingleCourse);

courseRouter.get("/get-all-courses", getAllCourses);

courseRouter.get(
  "/get-course-content/:id",
  isAuthenticated,
  getCourseContentByUser
);

export default courseRouter;
