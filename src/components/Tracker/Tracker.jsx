import { useEffect, useState } from "react";
import BalanceHint from "../BalanceHint/BalanceHint";
import Transactions from "../Transactions/Transactions";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import css from "./Tracker.module.css";

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

  const changeBalanceInput = e => {
    if (e.target.value === "" || Number(e.target.value) >= 0)
      setBalanceInput(e.target.value);
  };

  const confirmBalance = () => {
    setBalance(Number(balanceInput));
    setBalanceInput("");
  };

  const changeType = newType => {
    setType(newType);
    setForm(prev => ({ ...prev, category: "" }));
  };

  const addTransaction = () => {
    const amount = Number(form.amount);
    if (!form.description || !form.category || amount <= 0) return;

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

  const confirmDelete = () => {
    const item = transactions.find(tx => tx.id === deleteId);
    if (item) {
      setTransactions(prev => prev.filter(tx => tx.id !== deleteId));
      setBalance(prev => prev - signed(item));
    }
    setDeleteId(null);
  };

  return (
    <div className={css.page}>
      {notice && <div className={css.notify} role="alert">{notice}</div>}

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
        />
        <button
          className={css.confirmBtn}
          onClick={confirmBalance}
          disabled={!(Number(balanceInput) > 0)}
        >
          ПІДТВЕРДИТИ
        </button>
        <BalanceHint balance={balance} />
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
    </div>
  );
}