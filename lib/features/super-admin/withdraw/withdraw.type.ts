export interface WithdrawalProvider {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string;
    role: string;
    serviceName: string;
    completedJobs: number;
}

export interface WithdrawalItem {
    id: string;
    providerId: string;
    amount: number;
    accountNumber: string;
    status: "PENDING" | "APPROVED" | "PROCESSING" | "COMPLETED" | "REJECTED" | "CANCELLED";
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
    provider: WithdrawalProvider;
}

export interface WithdrawalMeta {
    totalPending: number;
    totalPendingAmount: number;
    todayApproved: number;
}

export interface GetAllWithdrawalsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export interface GetAllWithdrawalsResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        message: string;
        data: {
            pagination: {
                total: number;
                skip: number;
                limit: number;
                page: number;
                totalPage: number;
            };
            meta: WithdrawalMeta;
            data: WithdrawalItem[];
        };
    };
}
