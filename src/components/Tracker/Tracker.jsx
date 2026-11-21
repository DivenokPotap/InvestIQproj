import { useState } from "react";
import BalanceHint from "../BalanceHint/BalanceHint";
import Transactions from "../Transactions/Transactions";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import css from "./Tracker.module.css";
import { useDeleteTransactionMutation, useGetBalanceQuery, useGetTransactionsQuery, useSaveBalanceMutation, useSaveTransactionMutation } from "@/redux/Tracker/trackerApi";
import { useAuth } from "@/redux/Auth/useAuh";
import { CATEGORIES } from "@/constants";
import Reports from "@/components/Reports/Reports";

const CATEGORIES = {
  expense: [
    "Транспорт", "Продукти", "Здоров'я", "Алкоголь", "Розваги",
    "Все для дому", "Техніка", "Комуналка", "Спорт", "Освіта", "Інше",
  ],
  income: ["Зарплата", "Додатковий дохід"],
};

const now = new Date();
const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
  return {
    value: `${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`,
    label: d.toLocaleDateString("uk-UA", { month: "long", year: "numeric" }),
  };
});

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const signed = tx => (tx.type === "expense" ? -tx.amount : tx.amount);
const blockKeys = e => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault();

const Icon = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    strokeLinejoin="round">
    {children}
  </svg>
);

const EMPTY_FORM = { description: "", category: "", amount: "" };

export default function Tracker() {
  const [balance, setBalance] = useState(() => load("balance", 0));
  const [transactions, setTransactions] = useState(() => load("transactions", []));
  const [balanceInput, setBalanceInput] = useState("");
  const [type, setType] = useState("expense");
  const [form, setForm] = useState(EMPTY_FORM);
  const [month, setMonth] = useState(MONTHS[0].value);
  const [deleteId, setDeleteId] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("balance", JSON.stringify(balance));
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [balance, transactions]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const today = now.toLocaleDateString("uk-UA");
  const isIncome = type === "income";
  const dateLabel =
    month === MONTHS[0].value ? today : MONTHS.find(m => m.value === month).label;

  const field = name => e => {
    const { value } = e.target;
    if (name === "amount" && value !== "" && Number(value) < 0) return;
    setForm(prev => ({ ...prev, [name]: value }));
  };

export default function Tracker() { const { user } = useAuth()


  const [saveBalance] = useSaveBalanceMutation();
    const { data: savedBalance = 0 } = useGetBalanceQuery(user?.uid, {
  skip: !user?.uid,
});
  const [balanceInput, setBalanceInput] = useState("");
  const [type, setType] = useState("expense");
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
  } = useGetTransactionsQuery(user?.uid, {
    skip: !user?.uid,
  });

  const [saveTransaction] = useSaveTransactionMutation();


  const [deleteTransaction] = useDeleteTransactionMutation();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showReports, setShowReports] = useState(false);

  const changeBalanceInput = e => {
    if (e.target.value === "" || Number(e.target.value) >= 0)
      setBalanceInput(e.target.value);
  };

  const confirmBalance = async () => {
    try {
       const value = Number(balanceInput);
      if (value > 0) await saveBalance({ userId: user?.uid, balance: value }).unwrap();
        setBalanceInput("");
    } catch (error) {
      console.log(error)
    }
   
  };

  const changeType = newType => {
    setType(newType);
    setForm(prev => ({ ...prev, category: "" }));
  };

  const addTransaction = () => {
    const amount = Number(form.amount);
    if (!form.description || !form.category || amount <= 0) return;
  const addTransaction = async () => {
    const sum = Number(amount);
    if (!description || !category || sum <= 0) return;
    if (type === "expense" && sum > savedBalance) return;
    try {
      const value = type === "expense" ? savedBalance - sum : savedBalance + sum
      await saveTransaction({ transaction: { id: Date.now(), type, description, category, amount: sum, date: today }, userId: user?.uid}).unwrap();
      await saveBalance({userId: user?.uid, balance: value}).unwrap();
    clearForm();
    } catch (error) {
      console.log(error)
    }

  };

    if (!isIncome && amount > balance) {
      setNotice(`Недостатньо коштів. Ваш баланс: ${balance.toFixed(2)} UAH`);
      return;
    }

    const tx = { id: Date.now(), type, ...form, amount, date: today };
    setTransactions(prev => [...prev, tx]);
    setBalance(prev => prev + signed(tx));
    setMonth(MONTHS[0].value);
    setForm(EMPTY_FORM);
  };


const confirmDelete = async () => {
  const item = transactions.find(tx => tx.id === deleteId);

    if (!item || !user?.uid) return;
  try {
    if (item) {
      const value = item.type === "expense" ? savedBalance + item.amount : savedBalance - item.amount
           await deleteTransaction({userId: user?.uid, transactionId: item.id}).unwrap();
      await saveBalance({ userId: user?.uid, balance: value}
    ).unwrap() 
    }
    setDeleteId(null);
  } catch (error) {
       console.log(error)
  }
  
};


  return (
    <div className={css.page}>
      {notice && <div className={css.notify} role="alert">{notice}</div>}

        <title>Balance</title>
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
          placeholder={`${balance.toFixed(2)} UAH`}
          value={balanceInput}
          onChange={changeBalanceInput}
          onKeyDown={blockKeys}
          onWheel={e => e.target.blur()}
          placeholder={`${savedBalance.toFixed(2)} UAH`}
          value={balanceInput}
         onChange={e => {
    const value = e.target.value;
    if (Number(value) >= 0 || value === "") {
      setBalanceInput(value);
    }
  }}
  onKeyDown={e => {
    if (e.key === "-" || e.key === "e") {
      e.preventDefault();
    }
  }}
        />
        <button
          className={css.confirmBtn}
          onClick={confirmBalance}
          disabled={!(Number(balanceInput) > 0)}
        >
          ПІДТВЕРДИТИ
        </button>
        <BalanceHint balance={savedBalance} userId={user?.uid}/>
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
          {[["expense", "ВИТРАТИ"], ["income", "ДОХІД"]].map(([key, title]) => (
            <button
              key={key}
              className={type === key ? css.tabActive : css.tab}
              onClick={() => changeType(key)}
            >
              {title}
            </button>
          ))}
        </div>

        <div className={css.form}>
          <label className={css.date}>
            <Icon>
              <rect x="3" y="5" width="18" height="16" rx="2" />
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
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </label>

          <div className={css.fields}>
            <input
              className={css.input}
              placeholder={isIncome ? "Опис прибутку" : "Опис товару"}
              value={form.description}
              onChange={field("description")}
            />
            <select
              className={`${css.select} ${form.category ? "" : css.placeholder}`}
              value={form.category}
              onChange={field("category")}
            >
              <option value="">
                {isIncome ? "Категорія прибутку" : "Категорія товару"}
              </option>
              {CATEGORIES[type].map(name => (
                <option key={name} value={name}>{name}</option>
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
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <rect x="7" y="6" width="10" height="4" rx="1" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
              </Icon>
            </div>
          </div>

          <div className={css.btns}>
            <button className={css.primaryBtn} onClick={addTransaction}>
              ВВЕСТИ
            </button>
            <button className={css.secondaryBtn} onClick={() => setForm(EMPTY_FORM)}>
              ОЧИСТИТИ
            </button>
          </div>
        </div>

        <Transactions
          transactions={transactions}
          type={type}
          month={month}
          onDelete={setDeleteId}
        />

        {deleteId && (
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
