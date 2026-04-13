import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { GetSubAdminDashboardResponse } from "./dashboard.type";

export const subAdminDashboardAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getSubAdminDashboard: build.query<GetSubAdminDashboardResponse, void>({
            query: () => ({
                url: "/api/v1/analytics/sub-admin-dashboard",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetSubAdminDashboardQuery } = subAdminDashboardAPI;
