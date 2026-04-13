import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { 
  UpdateBannerStatusResponse, 
  DeleteBannerResponse,
  CreateBannerResponse,
  GetMarketingBannersResponse,
  GetMarketingBannersParams
} from "./marketing.type";

export const marketingAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getMarketingBanners: build.query<GetMarketingBannersResponse, GetMarketingBannersParams | void>({
      query: (params) => ({
        url: "/api/v1/marketing/admin/dashboard",
        method: "GET",
        params: params || { page: 1, limit: 10 },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['Marketing']
    }),
    updateBanner: build.mutation<UpdateBannerStatusResponse, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/api/v1/marketing/update/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ['Marketing']
    }),

    updateBannerStatus: build.mutation<UpdateBannerStatusResponse, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/api/v1/marketing/update-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ['Marketing']
    }),

    deleteBanner: build.mutation<DeleteBannerResponse, string>({
      query: (id) => ({
        url: `/api/v1/marketing/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Marketing']
    }),
    createBanner: build.mutation<CreateBannerResponse, FormData>({
      query: (body) => ({
        url: "/api/v1/marketing/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ['Marketing']
    }),
  }),
});

export const { 
  useGetMarketingBannersQuery, 
  useUpdateBannerStatusMutation, 
  useDeleteBannerMutation,
  useUpdateBannerMutation,
  useCreateBannerMutation,
} = marketingAPI;
