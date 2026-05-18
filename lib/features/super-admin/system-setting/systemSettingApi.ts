import { baseAPI } from "@/lib/baseAPI/baseAPI";

export const systemSettingApi = baseAPI.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSystemSetting: builder.query<any, void>({
      query: () => "/api/v1/system-setting/all",
      providesTags: ["Admin"],
    }),
    updateSystemSetting: builder.mutation<any, { value: number }>({
      query: (body) => ({
        url: "/api/v1/system-setting/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetSystemSettingQuery,
  useUpdateSystemSettingMutation,
} = systemSettingApi;
