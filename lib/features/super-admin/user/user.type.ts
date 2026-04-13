export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface UserItem {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  avatar: string | null;
  country: string;
  role: string;
  status: string;           // "ACTIVE" | "PENDING" | "SUSPENDED"
  verificationStatus: string; // "VERIFIED" | "UNVERIFIED"
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin: string | null;
  lastActive: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: {
    pagination: UserPagination;
    data: UserItem[];
  };
}
