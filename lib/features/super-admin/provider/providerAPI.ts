import { baseAPI } from "@/lib/baseAPI/baseAPI";
import {
  GetAllProvidersResponse,
  GetAllProvidersParams,
} from "./provider.type";

export const providerAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllProviders: build.query<GetAllProvidersResponse, GetAllProvidersParams | void>({
      query: (params) => ({
        url: "/api/v1/user/all-provider",
        method: "GET",
        params: params || { page: 1, limit: 10 },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["Provider"],
    }),

    verifyProvider: build.mutation<void, string>({
      query: (providerId) => ({
        url: "/api/v1/user/verified-provider",
        method: "PATCH",
        params: { providerId },
      }),
      invalidatesTags: ["Provider"],
    }),

    rejectProvider: build.mutation<void, string>({
      query: (providerId) => ({
        url: "/api/v1/user/reject-provider",
        method: "PATCH",
        params: { providerId },
      }),
      invalidatesTags: ["Provider"],
    }),
    toggleRecommendation: build.mutation<void, { id: string; isRecmmendation: boolean }>({
      query: ({ id, isRecmmendation }) => ({
        url: `/api/v1/expart-recommendation/expert-recommendation/${id}`,
        method: "PATCH",
        body: { isRecmmendation },
      }),
      invalidatesTags: ["Provider"],
    }),
  }),
});

export const {
  useGetAllProvidersQuery,
  useVerifyProviderMutation,
  useRejectProviderMutation,
  useToggleRecommendationMutation,
} = providerAPI;
