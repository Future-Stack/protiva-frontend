import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseQueryAPI = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://13.60.247.63',
  // baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://protiva-backend-ukw2.onrender.com',
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
   tagTypes: ["Auth", "User","Admin","Payment","Notification","Bookings", "Marketing", "Provider", "Category", "SubCategory","Transaction", "Dashboard","Job"],
   endpoints: () => ({}),
 });
