import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IUser } from "@/app/types/lms";
import { userLoggedIn } from "../auth/authSlice";

interface LoadUserResponse {
  accessToken?: string;
  user?: IUser;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  }),

  endpoints: (builder) => ({
    refreshToken: builder.query<unknown, unknown>({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    loadUser: builder.query<LoadUserResponse | null, unknown>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: "me",
          method: "GET",
          credentials: "include" as const,
        });

        if (result.error) {
          const status = result.error.status;

          if (status !== 400 && status !== 401 && status !== "FETCH_ERROR") {
            console.warn("Failed to load user session:", result.error);
          }

          return { data: null };
        }

        return { data: (result.data as LoadUserResponse | undefined) ?? null };
      },

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          if (result.data?.user) {
            dispatch(
              userLoggedIn({
                accessToken: result.data.accessToken ?? "",
                user: result.data.user,
              })
            );
          }
        } catch {
          // Errors are handled gracefully in queryFn
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
