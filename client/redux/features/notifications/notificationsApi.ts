import type { INotification } from "@/app/types/lms";
import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query<
      { success: boolean; notifications: INotification[] },
      unknown
    >({
      query: () => ({
        url: "get-all-notifications",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    updateNotificationStatus: builder.mutation<
      { success: boolean; notifications: INotification[] },
      string
    >({
      query: (id) => ({
        url: `/update-notification-status/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} = notificationsApi;
