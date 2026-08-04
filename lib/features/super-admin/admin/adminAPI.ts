import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { CreateAdminPayload, CreateAdminResponse, GetSubAdminsParams, GetSubAdminsResponse, UpdateAdminPermissionsPayload } from "./admin.type";

const adminAPI = baseAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        createAdmin: build.mutation<CreateAdminResponse, CreateAdminPayload>({
            query: (body) => ({
                url: "/api/v1/auth/admin/user/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),
        
        updateAdminPermissions: build.mutation<void, UpdateAdminPermissionsPayload>({
            query: (body) => ({
                url: "/api/v1/auth/admin/user/permissions",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),

        getSubAdmins: build.query<GetSubAdminsResponse, GetSubAdminsParams | void>({
            query: (params) => ({
                url: "/api/v1/user/get-sub-admins",
                method: "GET",
                params: params || { page: 1, limit: 10 },
            }),
            providesTags: ["Admin"],
        }),

        getSubAdminById: build.query<any, string>({
            query: (subAdminId) => ({
                url: `/api/v1/auth/sub_admin/${subAdminId}`,
                method: "GET",
            }),
            providesTags: (id) => [{ type: "Admin", id }],
        }),

        deleteSubAdmin: build.mutation<any, string>({
            query: (id) => ({
                url: `/api/v1/user/permanent-delete-sub-admin/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Admin"],
        }),
    }),
});

export const {
    useCreateAdminMutation,
    useUpdateAdminPermissionsMutation,
    useGetSubAdminsQuery,
    useGetSubAdminByIdQuery,
    useLazyGetSubAdminByIdQuery,
    useDeleteSubAdminMutation,
} = adminAPI;
