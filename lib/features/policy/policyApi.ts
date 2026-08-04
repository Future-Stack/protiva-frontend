import { baseAPI } from "@/lib/baseAPI/baseAPI";

export const policyApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPolicy: builder.query<any, void>({
      query: () => "api/v1/policy",
      providesTags: ["Policy"] as any,
    }),
    updatePolicy: builder.mutation<any, { content: string }>({
      query: (data) => ({
        url: "api/v1/policy/create",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Policy"] as any,
    }),
    getTerms: builder.query<any, void>({
      query: () => "api/v1/policy/terms-condition",
      providesTags: ["Policy"] as any,
    }),
    updateTerms: builder.mutation<any, { content: string }>({
      query: (data) => ({
        url: "api/v1/policy/terms-create",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Policy"] as any,
    }),
  }),
});

export const { 
  useGetPolicyQuery, 
  useUpdatePolicyMutation,
  useGetTermsQuery,
  useUpdateTermsMutation
} = policyApi;
