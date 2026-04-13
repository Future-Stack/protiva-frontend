import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { GetAllUsersParams, GetAllUsersResponse } from "./user.type";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<GetAllUsersResponse, GetAllUsersParams | void>({
      query: (params) => ({
        url: "/api/v1/user/get-all-user",
        method: "GET",
        params: params || { page: 1, limit: 10 },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["User"],
    }),

    deleteUser: build.mutation<void, string>({
      query: (userId) => ({
        url: "/api/v1/user/delete-user",
        method: "PATCH",
        params: { userId },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = userAPI;
