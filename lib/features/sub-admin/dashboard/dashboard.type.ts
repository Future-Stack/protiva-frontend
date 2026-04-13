export interface SubAdminDashboardActivity {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data: any;
    isRead: boolean;
    readAt: string | null;
    actionUrl: string | null;
    createdAt: string;
  }
  
  export interface SubAdminDashboardData {
    meta: {
      totalBooking: number;
      totalAcceptBooking: number;
      totalRejectBooking: number;
      totalInProgressBooking: number;
      totalCompliteBooking: number;
    };
    myPermissions: any | null;
    userRecentActivity: SubAdminDashboardActivity[];
  }
  
  export interface GetSubAdminDashboardResponse {
    data: SubAdminDashboardData;
    statusCode: number;
    timestamp: string;
    path: string;
  }
