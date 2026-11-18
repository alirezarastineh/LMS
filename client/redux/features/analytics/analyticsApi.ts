import type { IAnalyticsPoint } from "@/app/types/lms";
import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesAnalytics: builder.query<
      { success: boolean; courses: { last12Months: IAnalyticsPoint[] } },
      unknown
    >({
      query: () => ({
        url: "get-courses-analytics-admin",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getUsersAnalytics: builder.query<
      { success: boolean; users: { last12Months: IAnalyticsPoint[] } },
      unknown
    >({
      query: () => ({
        url: "get-users-analytics-admin",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getOrdersAnalytics: builder.query<
      { success: boolean; orders: { last12Months: IAnalyticsPoint[] } },
      unknown
    >({
      query: () => ({
        url: "get-orders-analytics-admin",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetCoursesAnalyticsQuery,
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
} = analyticsApi;
