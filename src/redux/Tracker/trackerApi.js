import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  ref,
  push,
  set,
  get,
  remove,
  update,
  onValue,
} from "firebase/database";

import { db } from "@/firebase/firebase";
import { serializeError } from "../Auth/authApi";

export const trackerApi = createApi({
  reducerPath: "trackerApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Transactions", "Balance", "Hint"],
  endpoints: builder => ({
    saveTransaction: builder.mutation({
      async queryFn({ transaction, userId }) {
        try {
          if (!userId) {
            throw new Error("User is not authorized");
          }

          const response = await push(ref(db, `users/${userId}/transactions`), {
            ...transaction,
          });
          return { data: response.key };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
      invalidatesTags: ["Transactions"],
    }),
    deleteTransaction: builder.mutation({
      async queryFn({ userId, transactionId }) {
        try {
          if (!userId || !transactionId) {
            throw new Error("Missing userId or transactionId");
          }

          const response = await remove(
            ref(db, `users/${userId}/transactions/${transactionId}`),
          );
          return { data: transactionId };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
      invalidatesTags: ["Transactions"],
    }),
    getTransactions: builder.query({
      async queryFn(userId) {
        try {
          const snapshot = await get(ref(db, `users/${userId}/transactions`));

          if (!snapshot.exists()) {
            return { data: [] };
          }

          const transactions = Object.entries(snapshot.val()).map(
            ([id, transaction]) => ({
              ...transaction,
              id,
            }),
          );

          return { data: transactions };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
      providesTags: ["Transactions"],
    }),
    saveBalance: builder.mutation({
      async queryFn({ userId, balance }) {
        try {
          const response = await set(ref(db, `users/${userId}/balance`), {
            balance,
          });
          return { data: balance };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
      invalidatesTags: ["Balance"],
    }),
    getBalance: builder.query({
      async queryFn(userId) {
        try {
          if (!userId) {
            throw new Error("User is not authorized");
          }

          const snapshot = await get(ref(db, `users/${userId}/balance`));

          if (!snapshot.exists()) {
            return { data: 0 };
          }

          return { data: snapshot.val().balance };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
      providesTags: ["Balance"],
    }),
    getHintSeen: builder.query({
      async queryFn(userId) {
        try {
          if (!userId) {
            throw new Error("User is not authorized");
          }

          const snapshot = await get(ref(db, `users/${userId}/hintSeen`));

          return {
            data: snapshot.exists() ? snapshot.val() : false,
          };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
      providesTags: ["Hint"],
    }),

    saveHintSeen: builder.mutation({
      async queryFn({ userId }) {
        try {
          if (!userId) {
            throw new Error("User is not authorized");
          }

          await set(ref(db, `users/${userId}/hintSeen`), true);

          return { data: true };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
      invalidatesTags: ["Hint"],
    }),
  }),
});

export const {
  useDeleteTransactionMutation,
  useSaveTransactionMutation,
  useGetTransactionsQuery,
  useGetBalanceQuery,
  useSaveBalanceMutation,
  useGetHintSeenQuery,
  useSaveHintSeenMutation,
} = trackerApi;
