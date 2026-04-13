import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { CreateSubCategoryResponse } from "./subCategory.type";

const subCategoryAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        // Create sub-category
        createSubCategory: build.mutation<CreateSubCategoryResponse, FormData>({
            query: (formData) => ({
                url: "/api/v1/sub-category/create",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Category"], // Sub-categories are linked to categories
        }),

        // Update sub-category
        updateSubCategory: build.mutation<any, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/api/v1/sub-category/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["Category"],
        }),

        // Delete sub-category
        deleteSubCategory: build.mutation<any, string>({
            query: (id) => ({
                url: `/api/v1/sub-category/${id}/deete`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

        // All job under sub category
        getSubCategoryJobs: build.query<any, { subCategoryId: string; page?: number; limit?: number }>({
            query: ({ subCategoryId, page = 1, limit = 10 }) => 
                `/api/v1/sub-category/sub-category/${subCategoryId}?page=${page}&limit=${limit}`,
        }),
    }),
});

export const {
    useCreateSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,
    useGetSubCategoryJobsQuery,
} = subCategoryAPI;
