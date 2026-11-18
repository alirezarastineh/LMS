import type { IOrder } from "@/app/types/lms";
import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<
      { success: boolean; orders: IOrder[] },
      unknown
    >({
      query: () => ({
        url: `get-all-orders-admin`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getStripePublishablekey: builder.query<{ publishablekey: string }, unknown>(
      {
        query: () => ({
          url: `payment/stripepublishablekey`,
          method: "GET",
          credentials: "include" as const,
        }),
      }
    ),

    createPaymentIntent: builder.mutation<
      { success: boolean; client_secret: string },
      number
    >({
      query: (amount) => ({
        url: "payment",
        method: "POST",
        body: {
          amount,
        },
        credentials: "include" as const,
      }),
    }),

    createOrder: builder.mutation<
      { success: boolean; order: IOrder },
      { courseId: string; payment_info: unknown }
    >({
      query: ({ courseId, payment_info }) => ({
        url: "create-order",
        body: {
          courseId,
          payment_info,
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetStripePublishablekeyQuery,
  useCreatePaymentIntentMutation,
  useCreateOrderMutation,
} = ordersApi;
