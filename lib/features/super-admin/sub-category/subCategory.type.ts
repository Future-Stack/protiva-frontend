import { CategoryItem } from "../category/category.type";

export interface SubCategoryItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    image: string;
    isActive: boolean;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    category?: CategoryItem;
    _count?: {
        jobs: number;
    };
}

export interface CreateSubCategoryResponse {
    data: SubCategoryItem;
    statusCode: number;
    message: string;
}

export interface GetSubCategoriesResponse {
    data: {
        success: boolean;
        data: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
            data: SubCategoryItem[];
        };
    };
    statusCode: number;
}
