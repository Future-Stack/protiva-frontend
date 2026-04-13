export interface Job {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: string;
  priceType: string;
  includeService: string[];
  thumbnail: string;
  features: any;
  images: string[];
  videos: string[];
  serviceLocation: any;
  serviceRadius: any;
  status: string;
  views: number;
  clicks: number;
  totalBookings: number;
  averageRating: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  isPopuler: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GetAllJobsParams {
  isPopuler?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface GetAllJobsResponse {
  data: {
    success: boolean;
    data: {
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
      };
      data: Job[];
    };
  };
  statusCode: number;
  timestamp: string;
  path: string;
}
