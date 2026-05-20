import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseQueryAPI = fetchBaseQuery({
  // baseUrl:'https://1z13k3v3-3000.inc1.devtunnels.ms/',
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.kaajbd.com.bd/',
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

 export const baseAPI = createApi({
   reducerPath: "baseAPI",
   baseQuery: baseQueryAPI,
   tagTypes: ["Auth", "User","Admin","Payment","Notification","Bookings", "Marketing", "Provider", "Category", "SubCategory","Transaction", "Dashboard","Job", "Policy", "Coupon"],
   endpoints: () => ({}),
 });
