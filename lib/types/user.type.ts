export interface LoginPayload {
    email: string;
    password: string;
}

export interface IUser {
    id: string;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string;
    bio: string | null;
    avatar: string | null;
    streetAddress: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    yearsOfExprience: number | null;
    nidNumber: string | null;
    nidImage: string | null;
    country: string | null;
    role: "SUPER_ADMIN" | "SUB_ADMIN" | "USER" | "PROVIDER";
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    verificationStatus: "VERIFIED" | "UNVERIFIED" | "PENDING";
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
    googleId: string | null;
    appleId: string | null;
    fcmToken: string | null;
    isProviderRecomendation: boolean;
    otpAttempts: number;
    lastLogin: string | null;
    lastActive: string | null;
    providerServiceAvailability: boolean;
    loginAttempts: number;
    lockedUntil: string | null;
    language: string;
    timezone: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    isContactInfoPublic: boolean;
    isProfilePublic: boolean;
    isNotificationEnabled: boolean;
    isBookingReminderEnabled: boolean;
}

export interface IUserResponse {
    data: IUser;
    statusCode: number;
    timestamp: string;
    path: string;
}