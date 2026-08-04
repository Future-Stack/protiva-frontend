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
    myPermissions: {
      id: string;
      userId: string;
      isViewBooking: boolean;
      isManageBooking: boolean;
      isExportBooking: boolean;
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
      grantedBy: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
    userRecentActivity: SubAdminDashboardActivity[];
  }
  
  export interface GetSubAdminDashboardResponse {
    data: SubAdminDashboardData;
    statusCode: number;
    timestamp: string;
    path: string;
  }
