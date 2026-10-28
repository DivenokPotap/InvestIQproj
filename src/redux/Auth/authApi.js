import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiClient, getToken } from "@/services/api";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({

        baseUrl: ApiClient.defaults.baseURL,
        
        prepareHeaders: (headers) => {
            const token = getToken()
            
            if (token) {
                headers.set("Authorization",`Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: ["Auth"],
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query(userData) {
                return {
                    url: "/users/login",
                    method: 'POST',
                    body: userData,
                }
            },
            invalidatesTags: ["Auth"]
        }),
         signUp: builder.mutation({
            query(userData) {
                return {
                    url: "/users/signup",
                    method: 'POST',
                    body: userData,
                }
            },
            invalidatesTags: ["Auth"]
         }),
          signOut: builder.mutation({
            query() {
                return {
                    url: "/users/logout",
                    method: 'POST',
                }
            },
            invalidatesTags: ["Auth"]
          }),
           getCurrent: builder.query({
            query: () => "users/current",
            providesTags: ["Auth"]
        }),
    })
})

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useGetCurrentQuery,
  useLazyGetCurrentQuery,
} = authApi;