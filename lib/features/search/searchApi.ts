import { baseAPI } from "../../baseAPI/baseAPI";

export interface SearchResult {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  type: "booking" | "user" | "provider" | "category" | "job";
  slug: string | null;
  thumbnail: string | null;
  extraId: string | null;
}

export interface SearchResponse {
  data: SearchResult[];
  statusCode: number;
  timestamp: string;
  path: string;
}

export const searchApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<SearchResponse, string>({
      query: (searchTerm) => `api/v1/job/global-search?search=${encodeURIComponent(searchTerm)}`,
    }),
  }),
});

export const { useGlobalSearchQuery } = searchApi;
