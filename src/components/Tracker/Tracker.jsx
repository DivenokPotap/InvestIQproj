import { useState } from "react";
import BalanceHint from "../BalanceHint/BalanceHint";
import Transactions from "../Transactions/Transactions";
import css from "./Tracker.module.css";

const CATEGORIES = {
  expense: [
    "Транспорт", "Продукти", "Здоров'я", "Алкоголь", "Розваги",
    "Все для дому", "Техніка", "Комуналка", "Спорт", "Освіта", "Інше",
  ],
  income: ["Зарплата", "Додатковий дохід"],
};

export default function Tracker() {
  const [balance, setBalance] = useState(0);
  const [balanceInput, setBalanceInput] = useState("");
  const [type, setType] = useState("expense");
  const [transactions, setTransactions] = useState([]);

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const today = new Date().toLocaleDateString("uk-UA");

  const confirmBalance = () => {
    const value = Number(balanceInput);
    if (value > 0) setBalance(value);
  };

  const changeType = newType => {
    setType(newType);
    setCategory(""); 
  };

  const clearForm = () => {
    setDescription("");
    setCategory("");
    setAmount("");
  };

  const addTransaction = () => {
    const sum = Number(amount);
    if (!description || !category || sum <= 0) return;
    if (type === "expense" && sum > balance) return;

    setTransactions(prev => [
      ...prev,
      { id: Date.now(), type, description, category, amount: sum, date: today },
    ]);
    setBalance(prev => (type === "expense" ? prev - sum : prev + sum));
    clearForm();
  };

  const deleteTransaction = id => {
    const item = transactions.find(tx => tx.id === id);
    if (!item) return;

    setTransactions(prev => prev.filter(tx => tx.id !== id));
    setBalance(prev =>
      item.type === "expense" ? prev + item.amount : prev - item.amount,
    );
  };

  return (
    <div className={css.page}>
      <div className={css.header}>
        <span className={css.label}>Баланс:</span>
        <input
          className={css.balanceInput}
          type="number"
          placeholder={`${balance.toFixed(2)} UAH`}
          value={balanceInput}
          onChange={e => setBalanceInput(e.target.value)}
        />
        <button className={css.confirmBtn} onClick={confirmBalance}>
          ПІДТВЕРДИТИ
        </button>
        <BalanceHint balance={balance} />
      </div>

      <div className={css.card}>
        <div className={css.tabs}>
          <button
            className={type === "expense" ? css.tabActive : css.tab}
            onClick={() => changeType("expense")}
          >
            ВИТРАТИ
          </button>
          <button
            className={type === "income" ? css.tabActive : css.tab}
            onClick={() => changeType("income")}
          >
            ДОХІД
          </button>
        </div>

        <div className={css.form}>
          <span className={css.date}>{today}</span>
          <div className={css.fields}>
            <input
              className={css.input}
              placeholder="Опис товару"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <select
              className={css.select}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Категорія товару</option>
              {CATEGORIES[type].map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <input
              className={css.sum}
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <button className={css.primaryBtn} onClick={addTransaction}>
            ВВЕСТИ
          </button>
          <button className={css.secondaryBtn} onClick={clearForm}>
            ОЧИСТИТИ
          </button>
        </div>

        <Transactions
          transactions={transactions}
          type={type}
          onDelete={deleteTransaction}
        />
      </div>
    </div>
  );
}