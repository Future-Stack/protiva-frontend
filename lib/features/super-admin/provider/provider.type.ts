export interface ProviderCount {
  jobs: number;
  receivedReviews: number;
}

export interface Provider {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  avatar: string | null;
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string;
  role: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "INACTIVE";
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "PENDING";
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin: string | null;
  lastActive: string | null;
  providerServiceAvailability: boolean;
  isProviderRecomendation: boolean;
  isRecmmendation?: boolean;
  loginAttempts: number;
  language: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count: ProviderCount;
  providerProfile: null | object;
  totalJobs: number;
  totalReviews: number;
  averageRating: number;
}

export interface ProviderPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllProvidersResponseData {
  data: Provider[];
  pagination: ProviderPagination;
}

export interface GetAllProvidersResponse {
  success: boolean;
  message: string;
  data: GetAllProvidersResponseData;
}

export interface GetAllProvidersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
