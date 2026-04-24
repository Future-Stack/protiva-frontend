import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import searchReducer from './features/search/searchSlice';
import { baseAPI } from './baseAPI/baseAPI';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      search: searchReducer,
      [baseAPI.reducerPath]: baseAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseAPI.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
