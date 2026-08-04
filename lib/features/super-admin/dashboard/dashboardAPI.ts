import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { SuperAdminDashboardResponse } from "./dashboard.type";

const dashboardAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getSuperAdminDashboard: build.query<SuperAdminDashboardResponse, void>({
            query: () => "/api/v1/analytics/super-admin-dashboard",
            providesTags: ["Dashboard"],
        }),
    }),
});

export const {
    useGetSuperAdminDashboardQuery,
} = dashboardAPI;
