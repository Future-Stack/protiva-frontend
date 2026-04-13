import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { GetAllJobsParams, GetAllJobsResponse } from "./job.type";

export const jobAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllJobs: build.query<GetAllJobsResponse, GetAllJobsParams | void>({
      query: (params) => ({
        url: "/api/v1/job/home-jobs",
        method: "GET",
        params: {
          isPopuler: params?.isPopuler,
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search,
          status: params?.status,
        },
      }),
      providesTags: ["Job"],
    }),

    makePopularJob: build.mutation<any, { id: string; isPopuler: boolean }>({
      query: ({ id, isPopuler }) => ({
        url: `/api/v1/job/make-populer/${id}`,
        method: "PATCH",
        params: { isPopuler }, // Sending as query param as per plan
      }),
      invalidatesTags: ["Job"],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useMakePopularJobMutation,
} = jobAPI;
