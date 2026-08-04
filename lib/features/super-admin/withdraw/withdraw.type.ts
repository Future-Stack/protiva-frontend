export interface WithdrawalItem {
    id: string;
    withdrawalNumber: string | null;
    userId: string;
    amount: string;
    fee: string;
    netAmount: string;
    bankName: string | null;
    accountNumber: string | null;
    accountHolderName: string | null;
    branchName: string | null;
    routingNumber: string | null;
    phoneNumber: string | null;
    mobileBankingType: string | null;
    mobileBankingPaymentTakeNumber: string | null;
    bankType: "MOBILE_BANKING" | "BANK" | string;
    status: "PENDING" | "APPROVED" | "PROCESSING" | "COMPLETED" | "REJECTED" | "CANCELLED";
    processedBy: string | null;
    processedAt: string | null;
    rejectionReason: string | null;
    requestedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface WithdrawalMeta {
    totalPending: number;
    totalPendingAmount: string;
    todayApproved: number;
}

export interface WithdrawalPagination {
    total: number;
    skip: number;
    limit: number;
    page: number;
    totalPage: number;
}

export interface GetAllWithdrawalsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export interface GetAllWithdrawalsResponse {
    data: {
        success: boolean;
        message: string;
        data: {
            pagination: WithdrawalPagination;
            meta: WithdrawalMeta;
            data: WithdrawalItem[];
        };
    };
    statusCode: number;
    timestamp: string;
    path: string;
}
