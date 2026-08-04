import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { 
    CouponResponse, 
    CreateCouponPayload, 
    UpdateCouponPayload, 
    SingleCouponResponse 
} from "./coupon.type";

const couponAPI = baseAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        getCoupons: build.query<CouponResponse, void>({
            query: () => ({
                url: "/api/v1/cupon/all",
                method: "GET",
            }),
            providesTags: ["Coupon"],
        }),

        createCoupon: build.mutation<SingleCouponResponse, CreateCouponPayload>({
            query: (body) => ({
                url: "/api/v1/cupon/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Coupon"],
        }),

        updateCoupon: build.mutation<SingleCouponResponse, UpdateCouponPayload>({
            query: ({ id, ...body }) => ({
                url: `/api/v1/cupon/update/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Coupon"],
        }),

        deleteCoupon: build.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/api/v1/cupon/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Coupon"],
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponAPI;
