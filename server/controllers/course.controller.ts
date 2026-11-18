import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import axios from "axios";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler, { getErrorMessage } from "../utils/ErrorHandler";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel, {
  IComment,
  ICommentReply,
  ICourse,
  IReview,
} from "../models/course.model";
import { redis } from "../utils/redis";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";

interface ICourseRequestBody extends Partial<Omit<ICourse, "thumbnail">> {
  thumbnail?: string | { public_id?: string; url?: string };
}

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as ICourseRequestBody;

      const thumbnail =
        typeof data.thumbnail === "string" ? data.thumbnail : undefined;

      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "Courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      createCourse(data as Partial<ICourse>, res, next);
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as ICourseRequestBody;

      const thumbnail =
        typeof data.thumbnail === "string" ? data.thumbnail : undefined;

      const courseId = req.params.id as string;

      const courseData = await CourseModel.findById(courseId);

      if (thumbnail) {
        if (thumbnail.startsWith("https")) {
          data.thumbnail = {
            public_id: courseData?.thumbnail?.public_id,
            url: courseData?.thumbnail?.url,
          };
        } else {
          if (courseData?.thumbnail?.public_id) {
            await cloudinary.v2.uploader.destroy(
              courseData.thumbnail.public_id
            );
          }

          const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            folder: "Courses",
          });

          data.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id as string;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist) as ICourse;

        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links"
        );

        await redis.set(courseId, JSON.stringify(course), "EX", 604_800);

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

export const getCourseContentByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id as string;

      const isAdmin = req.user?.role === "admin";

      const courseExists = userCourseList?.find(
        (course) => course._id?.toString() === courseId
      );

      if (!isAdmin && !courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId } = req.body as IAddQuestionData;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content ID", 400));
      }

      const courseContent = course?.courseData?.find((item) =>
        item._id?.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid Content ID", 400));
      }

      const newQuestion: IComment = {
        user: req.user,
        question,
        questionReplies: [],
      };

      courseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${courseContent?.title}`,
      });

      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId } =
        req.body as IAddAnswerData;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content ID", 400));
      }

      const courseContent = course?.courseData?.find((item) =>
        item._id?.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid Content ID", 400));
      }

      const question = courseContent?.questions?.find((item) =>
        item._id?.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid Question ID", 400));
      }

      const newAnswer: ICommentReply = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user?._id) {
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Received",
          message: `You have a new question reply in ${courseContent.title}`,
        });
      } else if (question.user?.email) {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: unknown) {
          return next(new ErrorHandler(getErrorMessage(error), 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const userId = req.user?._id;

      const courseId = req.params.id as string;

      const isAdmin = req.user?.role === "admin";

      const courseExists = userCourseList?.some(
        (course) => course._id?.toString() === courseId.toString()
      );

      if (isAdmin) {
        return next(
          new ErrorHandler("You are an Admin. You cannot add a review", 404)
        );
      }

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const hasReviewed = course?.reviews.some(
        (review) => review.user?._id.toString() === userId?.toString()
      );
      if (hasReviewed) {
        return next(
          new ErrorHandler("You have already reviewed this course", 400)
        );
      }

      const { review, rating } = req.body as IAddReviewData;

      const reviewData: IReview = {
        user: req.user,
        comment: review,
        rating,
      };

      course?.reviews.push(reviewData);

      let avg = 0;

      course?.reviews.forEach((rev) => {
        avg += rev.rating ?? 0;
      });

      if (course) {
        course.ratings = avg / course.reviews.length;
      }

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604_800);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Review Received",
        message: `${req.user?.name} has given a review in ${course?.name}`,
      });

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

interface IAddReplyReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReplyReviewData;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course?.reviews?.find(
        (rev) => rev._id?.toString() === reviewId.toString()
      );

      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: ICommentReply = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      review.commentReplies ??= [];

      review.commentReplies?.push(replyData);

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604_800);

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

export const getAllCoursesAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllCoursesService(res);
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 400));
    }
  }
);

export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await course.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 400));
    }
  }
);

export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body as { videoId: string };
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 400));
    }
  }
);
