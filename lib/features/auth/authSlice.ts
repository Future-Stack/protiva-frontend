import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar: string | null;
  adminPermissions?: {
    isViewBooking?: boolean;
    isManageBooking?: boolean;
    isExportBooking?: boolean;
    isViewProvider?: boolean;
    isManageProvider?: boolean;
    isViewUser?: boolean;
    isManageUser?: boolean;
    isViewCategory?: boolean;
    isManageCategory?: boolean;
    isViewTransaction?: boolean;
    isViewWithdrawal?: boolean;
    isManageWithdrawal?: boolean;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const getSafeStorageItem = (key: string) => {
  if (typeof window === "undefined") return null;
  const item = localStorage.getItem(key);
  if (!item || item === "undefined") return null;
  return item;
};

const getInitialUser = () => {
  const user = getSafeStorageItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
    return null;
  }
};

const initialState: AuthState = {
  user: getInitialUser(),
  accessToken: getSafeStorageItem("accessToken"),
  refreshToken: getSafeStorageItem("refreshToken"),
  isAuthenticated: !!getSafeStorageItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      const { user, accessToken, refreshToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
      
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      } else {
        localStorage.removeItem("accessToken");
      }
      
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;