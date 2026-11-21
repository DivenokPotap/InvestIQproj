
import { useEffect, useState } from "react";

import BalanceHint from "../BalanceHint/BalanceHint";
import Transactions from "../Transactions/Transactions";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

import css from "./Tracker.module.css";

import {
  useDeleteTransactionMutation,
  useGetBalanceQuery,
  useGetTransactionsQuery,
  useSaveBalanceMutation,
  useSaveTransactionMutation,
} from "@/redux/Tracker/trackerApi";

import { useAuth } from "@/redux/Auth/useAuh";
import { CATEGORIES } from "@/constants";
import Reports from "@/components/Reports/Reports";

const now = new Date();

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

  return {
    value: `${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`,
    label: d.toLocaleDateString("uk-UA", {
      month: "long",
      year: "numeric",
    }),
  };
});

const blockKeys = e => {
  if (["-", "+", "e", "E"].includes(e.key)) {
    e.preventDefault();
  }
};

const Icon = ({ children }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const EMPTY_FORM = {
  description: "",
  category: "",
  amount: "",
};

export default function Tracker() {
  const { user } = useAuth();

  // Firebase mutations
  const [saveBalance] = useSaveBalanceMutation();
  const [saveTransaction] = useSaveTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  // Firebase queries
  const {
    data: savedBalance = 0,
  } = useGetBalanceQuery(user?.uid, {
    skip: !user?.uid,
  });

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
  } = useGetTransactionsQuery(user?.uid, {
    skip: !user?.uid,
  });

  // Local component state
  const [balanceInput, setBalanceInput] = useState("");
  const [type, setType] = useState("expense");
  const [form, setForm] = useState(EMPTY_FORM);
  const [month, setMonth] = useState(MONTHS[0].value);
  const [deleteId, setDeleteId] = useState(null);
  const [notice, setNotice] = useState("");
  const [showReports, setShowReports] = useState(false);

  // Dates
  const today = new Date().toLocaleDateString("uk-UA");
  const isIncome = type === "income";

  const dateLabel =
    month === MONTHS[0].value
      ? today
      : MONTHS.find(m => m.value === month)?.label;

  // Hide notification
  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => {
      setNotice("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [notice]);

  // Form fields
  const field = name => e => {
    const { value } = e.target;

    if (name === "amount" && value !== "" && Number(value) < 0) {
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Balance input
  const changeBalanceInput = e => {
    const value = e.target.value;

    if (value === "" || Number(value) >= 0) {
      setBalanceInput(value);
    }
  };

  // Clear form
  const clearForm = () => {
    setForm(EMPTY_FORM);
  };

  // Save balance to Firebase
  const confirmBalance = async () => {
    if (!user?.uid) return;

    const value = Number(balanceInput);

    if (value <= 0) return;

    try {
      await saveBalance({
        userId: user.uid,
        balance: value,
      }).unwrap();

      setBalanceInput("");
    } catch (error) {
      console.error(error);
    }
  };

  // Change transaction type
  const changeType = newType => {
    setType(newType);

    setForm(prev => ({
      ...prev,
      category: "",
    }));
  };

  // Add transaction
  const addTransaction = async () => {
    if (!user?.uid) return;

    const amount = Number(form.amount);

    if (
      !form.description.trim() ||
      !form.category ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return;
    }

    if (type === "expense" && amount > savedBalance) {
      setNotice(
        `Недостатньо коштів. Ваш баланс: ${savedBalance.toFixed(2)} UAH`
      );
      return;
    }

    const transaction = {
      id: Date.now(),
      type,
      description: form.description,
      category: form.category,
      amount,
      date: today,
    };

    const newBalance =
      type === "expense"
        ? savedBalance - amount
        : savedBalance + amount;

    try {
      await saveTransaction({
        transaction,
        userId: user.uid,
      }).unwrap();

      await saveBalance({
        userId: user.uid,
        balance: newBalance,
      }).unwrap();

      clearForm();
      setMonth(MONTHS[0].value);
      setNotice("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete transaction
  const confirmDelete = async () => {
    if (!user?.uid) return;

    const item = transactions.find(tx => tx.id === deleteId);

    if (!item) return;

    const newBalance =
      item.type === "expense"
        ? savedBalance + item.amount
        : savedBalance - item.amount;

    try {
      await deleteTransaction({
        userId: user.uid,
        transactionId: item.id,
      }).unwrap();

      await saveBalance({
        userId: user.uid,
        balance: newBalance,
      }).unwrap();

      setDeleteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={css.page}>
      <title>Balance</title>

      {notice && (
        <div className={css.notify} role="alert">
          {notice}
        </div>
      )}

      {showReports ? (
        <Reports
          balance={savedBalance}
          transactions={transactions}
          onBack={() => setShowReports(false)}
        />
      ) : (
        <>
          <div className={css.header}>
            <span className={css.label}>Баланс:</span>

            <input
              className={css.balanceInput}
              type="number"
              min="0"
              step="0.01"
              placeholder={`${savedBalance.toFixed(2)} UAH`}
              value={balanceInput}
              onChange={changeBalanceInput}
              onKeyDown={blockKeys}
              onWheel={e => e.target.blur()}
            />

            <button
              className={css.confirmBtn}
              onClick={confirmBalance}
              disabled={!(Number(balanceInput) > 0)}
            >
              ПІДТВЕРДИТИ
            </button>

            <BalanceHint
              balance={savedBalance}
              userId={user?.uid}
            />

            <button
              type="button"
              className={css.reportsLink}
              onClick={() => setShowReports(true)}
            >
              Перейти до розрахунків

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff751d"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M5 20V10M12 20V4M19 20v-7" />
              </svg>
            </button>
          </div>

          <div className={css.card}>
            <div className={css.tabs}>
              {[["expense", "ВИТРАТИ"], ["income", "ДОХІД"]].map(
                ([key, label]) => (
                  <button
                    key={key}
                    className={
                      type === key ? css.tabActive : css.tab
                    }
                    onClick={() => changeType(key)}
                  >
                    {label}
                  </button>
                )
              )}
            </div>

            <div className={css.form}>
              <label className={css.date}>
                <Icon>
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                  />
                  <path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2M8 18h2M14 18h2" />
                </Icon>

                <span>{dateLabel}</span>

                <select
                  className={css.monthSelect}
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  aria-label="Обрати місяць"
                >
                  {MONTHS.map(m => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className={css.fields}>
                <input
                  className={css.input}
                  placeholder={
                    isIncome ? "Опис прибутку" : "Опис товару"
                  }
                  value={form.description}
                  onChange={field("description")}
                />

                <select
                  className={`${css.select} ${
                    form.category ? "" : css.placeholder
                  }`}
                  value={form.category}
                  onChange={field("category")}
                >
                  <option value="">
                    {isIncome
                      ? "Категорія прибутку"
                      : "Категорія товару"}
                  </option>

                  {CATEGORIES[type].map(name => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>

                <div className={css.sumBox}>
                  <input
                    className={css.sum}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="00.00 UAH"
                    value={form.amount}
                    onChange={field("amount")}
                    onKeyDown={blockKeys}
                    onWheel={e => e.target.blur()}
                  />

                  <Icon>
                    <rect
                      x="4"
                      y="3"
                      width="16"
                      height="18"
                      rx="2"
                    />
                    <rect
                      x="7"
                      y="6"
                      width="10"
                      height="4"
                      rx="1"
                    />
                    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                  </Icon>
                </div>
              </div>

              <div className={css.btns}>
                <button
                  className={css.primaryBtn}
                  onClick={addTransaction}
                >
                  ВВЕСТИ
                </button>

                <button
                  className={css.secondaryBtn}
                  onClick={clearForm}
                >
                  ОЧИСТИТИ
                </button>
              </div>
            </div>

            {transactionsLoading ? (
              <p>Завантаження транзакцій...</p>
            ) : (
              <Transactions
                transactions={transactions}
                type={type}
                month={month}
                onDelete={setDeleteId}
              />
            )}

            {deleteId !== null && (
              <ConfirmModal
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
