import { auth, provider } from "@/firebase/firebase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";

const serializeUser = user => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
  providerData: user.providerData.map(provider => ({
    providerId: provider.providerId,
    uid: provider.uid,
    displayName: provider.displayName,
    email: provider.email,
    photoURL: provider.photoURL,
  })),
});

const serializeError = error => ({
  status: "CUSTOM_ERROR",
  error: error.message || "Unknown error",
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    signUp: builder.mutation({
      async queryFn({ name, email, password }) {
        try {
          const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          await updateProfile(result.user, {
            displayName: name,
          });

          return { data: serializeUser(result.user) };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
    }),
    signIn: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const result = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
          return { data: serializeUser(result.user) };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
    }),
    signOut: builder.mutation({
      async queryFn() {
        try {
          await signOut(auth);
          return { data: true };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
    }),
    signInWithGoogle: builder.mutation({
      async queryFn() {
        try {
          const result = await signInWithPopup(auth, provider);
          return { data: serializeUser(result.user) };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
    }),
    getCurrent: builder.query({
      async queryFn() {
        try {
          const user = await new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(
              auth,
              user => {
                unsubscribe(), resolve(user);
              },
              error => {
                unsubscribe();
                reject(error);
              },
            );
          });

          return {
            data: user ? serializeUser(user) : null,
          };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
    }),
    onAuthChange: builder.query({
        queryFn: () => ({ data: null }), 
        
        async onCacheEntryAdded(
            _, {updateCachedData, cacheEntryRemoved}
        ) {
            const unsubscribe = onAuthStateChanged(
                auth, user => (
                    updateCachedData(() => (
                        user ? serializeUser(user) : null
                    ))
            ))
                   await cacheEntryRemoved;
                   unsubscribe();
        }
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignInWithGoogleMutation,
  useSignOutMutation,
  useGetCurrentQuery,
  useOnAuthChangeQuery,
  useLazyGetCurrentQuery,
} = authApi;