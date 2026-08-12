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
    isJobView?: boolean;
    isJobManage?: boolean;
    isManageMarketing?: boolean;
    isViewManageMarketing?: boolean;
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
    console.log("Error parsing user from localStorage:", e);
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

      if (user !== undefined) {
        state.user = user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }
      }

      if (accessToken !== undefined) {
        state.accessToken = accessToken;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        } else {
          localStorage.removeItem("accessToken");
        }
      }

      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        } else {
          localStorage.removeItem("refreshToken");
        }
      }

      state.isAuthenticated = !!state.accessToken;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;