export interface AdminPermissions {
    isViewBooking: boolean;
    isManageBooking: boolean;
    isViewProvider: boolean;
    isManageProvider: boolean;
    isViewUser: boolean;
    isManageUser: boolean;
    isViewCategory: boolean;
    isManageCategory: boolean;
    isViewTransaction: boolean;
    isViewWithdrawal: boolean;
    isManageWithdrawal: boolean;
    isJobView: boolean;
    isJobManage: boolean;
    isViewMarketing: boolean;
    isManageMarketing: boolean;
    isExportBooking: boolean;
}

export interface CreateAdminPayload extends AdminPermissions {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

export interface UpdateAdminPermissionsPayload extends AdminPermissions {
    userId: string;
}

export interface AdminItem extends AdminPermissions {
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
    isViewMarketing: boolean;
    isManageMarketing: boolean;
    isExportBooking: boolean;
    status: "ACTIVE" | "INACTIVE";
    verificationStatus: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    language: string;
    timezone: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAdminResponse {
    success: boolean;
    message: string;
    data?: AdminItem;
}

export interface GetSubAdminsParams {
    status?: string;
    search?: string;
    limit?: number;
    page?: number;
}

export interface GetSubAdminsResponse {
    data: {
        data: AdminItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPage: number;
        };
    };
    statusCode: number;
    timestamp: string;
    path: string;
}
