import { flightApi } from "./flightApi";

export const flightPlacesSearchApi = flightApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlacesSearch: builder.mutation({
      query: (query) => ({
        method: "POST",
        url: "/api/flight/query",
        body: query,
        cache: "force-cache",
      }),
    }),
  }),
});

export const { useGetPlacesSearchMutation } = flightPlacesSearchApi;