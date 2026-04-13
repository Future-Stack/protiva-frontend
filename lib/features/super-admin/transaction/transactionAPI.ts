import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { GetAllTransactionsParams, GetAllTransactionsResponse } from "./transaction.type";

const transactionAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        // Get all transactions (paginated with filters)
        getAllTransactions: build.query<GetAllTransactionsResponse, GetAllTransactionsParams | void>({
            query: (params) => ({
                url: "/api/v1/transection/all-transections",
                method: "GET",
                params: params || { page: 1, limit: 15 },
            }),
            providesTags: ["Transaction"],
        }),
    }),
});

export const {
    useGetAllTransactionsQuery,
} = transactionAPI;
