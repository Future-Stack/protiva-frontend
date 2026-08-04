export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  targetRole: string | null;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "DEACTIVATE" | "DRAFT";
  impressions: number;
  clicks: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingStats {
  active: number;
  scheduled: number;
  deactivated: number;
  total: number;
}

export interface MarketingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetMarketingBannersResponse {
  success: boolean;
  message: string;
  pagination: MarketingPagination;
  stats: MarketingStats;
  data: Banner[];
}

export interface UpdateBannerStatusResponse {
  success: boolean;
  message: string;
  data: Banner;
}

export interface DeleteBannerResponse {
  success: boolean;
  message: string;
}

export interface CreateBannerResponse {
  data: {
    success: boolean;
    message: string;
    data: Banner;
  };
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface GetMarketingBannersParams {
  page?: number;
  limit?: number;
}
