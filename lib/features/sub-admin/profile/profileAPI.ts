import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { SubAdminProfileResponse } from "./profile.type";

export const profileAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSubAdminProfile: build.query<SubAdminProfileResponse, void>({
      query: () => ({
        url: "/api/v1/auth/sub_admin/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    // getAdminProfile: build.query<SubAdminProfileResponse, void>({
    //   query: () => ({
    //     url: "/api/v1/auth/profile",
    //     method: "GET",
    //   }),
    //   providesTags: ["User"],
    // }),
  }),
});

export const { useGetSubAdminProfileQuery } = profileAPI;
