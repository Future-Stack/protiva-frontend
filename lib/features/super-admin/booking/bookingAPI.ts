import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { AllBookingsQuery, AllBookingsResponse, UserTotalBookingResponse } from "./booking.type";

export const bookingAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllBookings: build.query<AllBookingsResponse, AllBookingsQuery | void>({
      query: (params) => ({
        url: "/api/v1/bookings/all-booking",
        method: "GET",
        params: params || { limit: 10, page: 1 },
      }),
      providesTags: ["Bookings"] as any,
    }),
    getUserTotalBooking: build.query<UserTotalBookingResponse, string>({
      query: (userId) => ({
        url: `/api/v1/bookings/user-total-booking/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "Bookings", id: `TOTAL_${userId}` }],
    }),
  }),
});

export const { useGetAllBookingsQuery, useGetUserTotalBookingQuery } = bookingAPI;