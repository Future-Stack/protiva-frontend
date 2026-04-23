import { IUserResponse, LoginPayload } from "@/lib/types/user.type";
import { baseAPI } from "@/lib/baseAPI/baseAPI";

 const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<any, LoginPayload>({
      query: (body) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateProfile: build.mutation<any, { fildName: string; value: string }>({
      query: (body) => ({
        url: "/api/v1/auth/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    getMe: build.query<IUserResponse, void>({
      query: () => ({
        url: "/api/v1/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    changePassword: build.mutation<any, any>({
      query: (body) => ({
        url: "/api/v1/auth/change-password",
        method: "PATCH",
        body,
      }),
    }),
    updateAvatar: build.mutation<any, FormData>({
      query: (body) => ({
        url: "/api/v1/auth/updateUserProfile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useUpdateProfileMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useUpdateAvatarMutation,
} = userAPI;
