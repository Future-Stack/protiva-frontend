import { TransactionItem } from "../transaction/transaction.type";

export interface DashboardMeta {
    totalUser: number;
    totalProvider: number;
    compliteBooking: number;
    totalAcceptBooking: number;
    totalRejectBooking: number;
    totalProviderEarningPayment: string;
    totalGivePaymentToProvider: number;
}

export interface DashboardAnalytics {
    month_date: string;
    month_name: string;
    total_bookings: number;
    total_accepted: number;
    total_rejected: number;
    completed_payment_total: string;
    payment_growth_percentage: number | null;
    booking_growth_percentage: number | null;
    accepted_growth_percentage: number | null;
    rejected_growth_percentage: number | null;
}

export interface UserLastActivity {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data: any | null;
    isRead: boolean;
    readAt: string | null;
    actionUrl: string | null;
    createdAt: string;
}

export interface SuperAdminDashboardData {
    meta: DashboardMeta;
    analytics: DashboardAnalytics[];
    recentTransection: TransactionItem[];
    last10RecentBookign: TransactionItem[];
    userLastActivity: UserLastActivity[];
}

export interface SuperAdminDashboardResponse {
    data: SuperAdminDashboardData;
    statusCode: number;
    timestamp: string;
    path: string;
}
