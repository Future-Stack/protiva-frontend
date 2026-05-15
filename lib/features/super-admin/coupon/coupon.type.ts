export interface Coupon {
    id: string;
    couponCode: string;
    discountPercentage: number;
    isActive: boolean;
    totalUselimit: number;
    expireAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCouponPayload {
    couponCode: string;
    discountPercentage: number;
    isActive: boolean;
    totalUselimit: number;
    expireAt: string;
}

export interface UpdateCouponPayload extends CreateCouponPayload {
    id: string;
}

export interface CouponResponse {
    data: {
        success: boolean;
        message: string;
        data: Coupon[];
    };
    statusCode: number;
    timestamp: string;
    path: string;
}

export interface SingleCouponResponse {
    success: boolean;
    message: string;
    data: Coupon;
}
