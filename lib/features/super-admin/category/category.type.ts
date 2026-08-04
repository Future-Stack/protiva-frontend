export interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    image: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryResponse {
    success: boolean;
    message: string;
    data: CategoryItem;
}

export interface GetAllCategoriesResponse {
    data: {
        success: boolean;
        data: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            data: CategoryItem[];
        };
    };
    statusCode: number;
    message?: string;
}
