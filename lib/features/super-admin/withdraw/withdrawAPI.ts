import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { GetAllWithdrawalsParams, GetAllWithdrawalsResponse } from "./withdraw.type";

const withdrawAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getAllWithdrawals: build.query<GetAllWithdrawalsResponse, GetAllWithdrawalsParams | void>({
            query: (params) => ({
                url: "/api/v1/withdraw/get-all",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["Payment"],
        }),

        approveWithdrawal: build.mutation<any, string>({
            query: (withdrawId) => ({
                url: `/api/v1/withdraw/approve-withdraw?withdrawId=${withdrawId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Payment"],
        }),

        rejectWithdrawal: build.mutation<any, string>({
            query: (withdrawId) => ({
                url: `/api/v1/withdraw/reject-withdraw?withdrawId=${withdrawId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Payment"],
        }),
    }),
});

export const {
    useGetAllWithdrawalsQuery,
    useApproveWithdrawalMutation,
    useRejectWithdrawalMutation,
} = withdrawAPI;
