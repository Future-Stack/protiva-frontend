import { baseAPI } from "@/lib/baseAPI/baseAPI";
import { AppVersionConfigResponse, UpdateAppVersionConfigPayload } from "./versionConfig.type";

const versionConfigAPI = baseAPI.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getVersionConfig: build.query<AppVersionConfigResponse, void>({
      query: () => ({
        url: "/api/v1/app-version-config/find",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    updateVersionConfig: build.mutation<any, UpdateAppVersionConfigPayload>({
      query: (body) => ({
        url: "/api/v1/app-version-config/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetVersionConfigQuery,
  useUpdateVersionConfigMutation,
} = versionConfigAPI;
