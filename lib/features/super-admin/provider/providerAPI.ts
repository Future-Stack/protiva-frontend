import { baseAPI } from "@/lib/baseAPI/baseAPI";
import {
  GetAllProvidersResponse,
  GetAllProvidersParams,
  AddProviderPayload,
  AddProviderResponse,
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

    updateServiceAvailability: build.mutation<any, { providerId: string; isAvailable: boolean }>({
      query: ({ providerId, isAvailable }) => ({
        url: `/api/v1/job/service-availability/${providerId}`,
        method: "PATCH",
        params: { isAvailable },
      }),
      invalidatesTags: ["Provider"],
    }),

    getProviderJobs: build.query<any, string>({
      query: (providerId) => ({
        url: `/api/v1/job/provider/${providerId}/jobs`,
        method: "GET",
      }),
      providesTags: ["Provider"],
    }),

    addProvider: build.mutation<AddProviderResponse, AddProviderPayload>({
      query: (payload) => {
        const formData = new FormData();
        formData.append("firstName", payload.firstName);
        formData.append("lastName", payload.lastName);
        formData.append("email", payload.email);
        formData.append("phone", payload.phone);
        formData.append("password", payload.password);
        formData.append("city", payload.city);
        formData.append("nidNumber", payload.nidNumber);
        formData.append("serviceLocation", payload.serviceLocation);
        formData.append("yearOfExprience", payload.yearOfExprience);
        formData.append("bio", payload.bio);
        formData.append("avatar", payload.avatar);
        formData.append("nidImage", payload.nidImage);
        formData.append("nidBackImage", payload.nidBackImage);
        return {
          url: "/api/v1/auth/add-provider",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Provider"],
    }),
  }),
});

export const {
  useGetAllProvidersQuery,
  useVerifyProviderMutation,
  useRejectProviderMutation,
  useToggleRecommendationMutation,
  useAddProviderMutation,
  useUpdateServiceAvailabilityMutation,
  useGetProviderJobsQuery,
} = providerAPI;
