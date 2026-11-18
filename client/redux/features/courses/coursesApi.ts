import type {
  ICourse,
  ICourseDataItem,
  ICoursePayload,
  IEditCoursePayload,
} from "@/app/types/lms";
import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation<unknown, ICoursePayload>({
      query: (data) => ({
        url: "upload-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    getAllCourses: builder.query<
      { success: boolean; courses: ICourse[] },
      unknown
    >({
      query: () => ({
        url: "get-all-courses-admin",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    deleteCourse: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    editCourse: builder.mutation<
      unknown,
      { id: string; data: IEditCoursePayload }
    >({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),

    getUsersAllCourses: builder.query<
      { success: boolean; courses: ICourse[] },
      unknown
    >({
      query: () => ({
        url: "get-all-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getCourseDetails: builder.query<
      { success: boolean; course: ICourse },
      string
    >({
      query: (id) => ({
        url: `get-single-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getCourseContent: builder.query<
      { success: boolean; content: ICourseDataItem[] },
      string
    >({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    addNewQuestion: builder.mutation<
      unknown,
      { question: string; courseId: string; contentId: string }
    >({
      query: ({ question, courseId, contentId }) => ({
        url: "add-question",
        body: {
          question,
          courseId,
          contentId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),

    addAnswerInQuestion: builder.mutation<
      unknown,
      {
        answer: string;
        courseId: string;
        contentId: string;
        questionId: string;
      }
    >({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: "add-answer",
        body: {
          answer,
          courseId,
          contentId,
          questionId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),

    addReviewInCourse: builder.mutation<
      unknown,
      { review: string; rating: number; courseId: string }
    >({
      query: ({ review, rating, courseId }) => ({
        url: `add-review/${courseId}`,
        body: {
          review,
          rating,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),

    addReplyInReview: builder.mutation<
      unknown,
      { comment: string; courseId: string; reviewId: string }
    >({
      query: ({ comment, courseId, reviewId }) => ({
        url: `add-reply-to-review`,
        body: {
          comment,
          courseId,
          reviewId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetUsersAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
} = coursesApi;
