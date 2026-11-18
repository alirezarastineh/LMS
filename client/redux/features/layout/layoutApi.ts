import type { ICategoryItem, IFaqItem, ILayout } from "@/app/types/lms";
import { apiSlice } from "../api/apiSlice";

type EditLayoutPayload = {
  type: string;
  image?: string;
  title?: string;
  subtitle?: string;
  faq?: IFaqItem[];
  categories?: ICategoryItem[];
};

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroData: builder.query<
      { success: boolean; layout: ILayout | null },
      string
    >({
      query: (type) => ({
        url: `get-layout-admin/${type}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    editLayout: builder.mutation<unknown, EditLayoutPayload>({
      query: ({ type, image, title, subtitle, faq, categories }) => ({
        url: `edit-layout-admin`,
        body: {
          type,
          image,
          title,
          subtitle,
          faq,
          categories,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetHeroDataQuery, useEditLayoutMutation } = layoutApi;
