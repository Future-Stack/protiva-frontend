import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { logout, setCredentials } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  // baseUrl:'https://1z13k3v3-3000.inc1.devtunnels.ms/',
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.kaajbd.com.bd/',
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as RootState).auth?.accessToken;
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("accessToken");
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const url = typeof args === "string" ? args : args.url;

    // Do not attempt to refresh token if the failed request was login or refresh itself
    if (url.includes("/api/v1/auth/login") || url.includes("/api/v1/auth/refresh")) {
      return result;
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const state = api.getState() as RootState;
          let refreshToken = state.auth?.refreshToken;
          if (!refreshToken && typeof window !== "undefined") {
            refreshToken = localStorage.getItem("refreshToken");
          }

          if (!refreshToken) {
            api.dispatch(logout());
            if (typeof window !== "undefined" && window.location.pathname !== "/") {
              window.location.href = "/";
            }
            return false;
          }

          // Request new tokens using refresh endpoint
          const refreshResult = await baseQuery(
            {
              url: "/api/v1/auth/refresh",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const resData: any = refreshResult.data;
            const newAccessToken = resData?.data?.accessToken || resData?.accessToken;
            const newRefreshToken = resData?.data?.refreshToken || resData?.refreshToken;

            if (newAccessToken) {
              const currentUser =
                state.auth?.user ||
                (typeof window !== "undefined" && localStorage.getItem("user")
                  ? JSON.parse(localStorage.getItem("user")!)
                  : null);

              api.dispatch(
                setCredentials({
                  user: currentUser,
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken || refreshToken,
                })
              );
              return true;
            }
          }

          // If refresh failed (e.g. invalid or expired refresh token)
          api.dispatch(logout());
          if (typeof window !== "undefined" && window.location.pathname !== "/") {
            window.location.href = "/";
          }
          return false;
        } catch {
          api.dispatch(logout());
          if (typeof window !== "undefined" && window.location.pathname !== "/") {
            window.location.href = "/";
          }
          return false;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const refreshSuccess = await refreshPromise;

    if (refreshSuccess) {
      // Retry original request with newly saved accessToken
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User","Admin","Payment","Notification","Bookings", "Marketing", "Provider", "Category", "SubCategory","Transaction", "Dashboard","Job", "Policy", "Coupon"],
  endpoints: () => ({}),
});
