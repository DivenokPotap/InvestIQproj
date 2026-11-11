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
  tagTypes: ["Transactions"],
  endpoints: builder => ({
    saveTransaction: builder.mutation({
      async queryFn({ transaction, userId }) {
        try {
          const response = await push(ref(db, `users/${userId}transactions`), {
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
              id,
              ...transaction,
            }),
          );

          return { data: transactions };
        } catch (e) {
          return { error: serializeError(e) };
        }
      },
      providesTags: ["Transactions"],
    }),
  }),
});

export const {
  useDeleteTransactionMutation,
  useSaveTransactionMutation,
  useLazyGetTransactionsQuery,
} = trackerApi;
