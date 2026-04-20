export interface AdminPermissions {
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
  isViewMarketing: boolean;
  isManageMarketing: boolean;
}

export interface SubAdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  verificationStatus: string;
  adminPermissions: AdminPermissions;
}

export interface SubAdminProfileResponse {
  data: {
    user: SubAdminProfile;
  };
  status: string;
}
