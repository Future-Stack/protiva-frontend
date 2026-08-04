import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { CreateCategoryResponse, GetAllCategoriesResponse } from "./category.type";
import { GetSubCategoriesResponse } from "../sub-category/subCategory.type";

const categoryAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        // Get all categories (paginated)
        getAllCategories: build.query<GetAllCategoriesResponse, { limit?: number; page?: number }>({
            query: ({ limit = 15, page = 1 } = {}) => 
                `/api/v1/category/all-categoris-for-user?limit=${limit}&page=${page}`,
            providesTags: ["Category"],
        }),

        // Get single category
        getCategoryById: build.query<any, string>({
            query: (id) => `/api/v1/category/${id}`,
            providesTags: ["Category"],
        }),

        // Create category
        createCategory: build.mutation<CreateCategoryResponse, FormData>({
            query: (formData) => ({
                url: "/api/v1/category/create",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Category"],
        }),

        // Update category
        updateCategory: build.mutation<any, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/api/v1/category/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["Category"],
        }),

        // Delete category
        deleteCategory: build.mutation<any, string>({
            query: (id) => ({
                url: `/api/v1/category/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

        // Get all sub-categories of a category
        getSubCategories: build.query<GetSubCategoriesResponse, { categoryId: string; limit?: number; page?: number }>({
            query: ({ categoryId, limit = 15, page = 1 }) => 
                `/api/v1/category/sub-categories/${categoryId}?limit=${limit}&page=${page}`,
            providesTags: ["Category"],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetSubCategoriesQuery,
} = categoryAPI;
