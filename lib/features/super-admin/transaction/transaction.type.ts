export interface TransactionItem {
    id: string;
    transactionId: string;
    bookingId: string;
    userId: string;
    gateway: string;
    method: string | null;
    amount: string;
    currency: string;
    gatewayTxnId: string | null;
    gatewayResponse: string | null;
    status: "COMPLETED" | "FAILED" | "CANCELLED" | "PENDING";
    failureReason: string | null;
    metadata: any | null;
    initiatedAt: string;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GetAllTransactionsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export interface GetAllTransactionsResponse {
    data: {
        data: TransactionItem[];
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
