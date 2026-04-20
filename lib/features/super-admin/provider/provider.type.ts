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
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "PENDING" | "REJECTED";
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin: string | null;
  lastActive: string | null;
  providerServiceAvailability: boolean;
  isProviderRecomendation: boolean;
  isRecmmendation?: boolean;
  nidImage: string | null;
  nidNumber: string | null;
  yearsOfExprience: string | null;
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

export interface AddProviderPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  nidNumber: string;
  serviceLocation: string;
  yearOfExprience: string;
  bio: string;
  avatar: File;
  nidImage: File;
}

export interface AddProviderResponseData {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  streetAddress: string;
  city: string;
  role: string;
  status: string;
  verificationStatus: string;
  createdAt: string;
}

export interface AddProviderResponse {
  data: AddProviderResponseData;
  statusCode: number;
  timestamp: string;
  path: string;
}
