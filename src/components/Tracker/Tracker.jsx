import { useState } from "react";
import BalanceHint from "../BalanceHint/BalanceHint";
import Transactions from "../Transactions/Transactions";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import css from "./Tracker.module.css";
import { useDeleteTransactionMutation, useGetBalanceQuery, useGetTransactionsQuery, useSaveBalanceMutation, useSaveTransactionMutation } from "@/redux/Tracker/trackerApi";
import { useAuth } from "@/redux/Auth/useAuh";
import { CATEGORIES } from "@/constants";
import Reports from "../Reports/Reports";


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

  const today = new Date().toLocaleDateString("uk-UA");

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
    setCategory("");
  };

  const clearForm = () => {
    setDescription("");
    setCategory("");
    setAmount("");
  };

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

  const askDelete = id => setDeleteId(id);


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


  const cancelDelete = () => setDeleteId(null);

  return (
    <div className={css.page}>
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
          placeholder={`${savedBalance.toFixed(2)} UAH`}
          value={balanceInput}
          onChange={e => setBalanceInput(e.target.value)}
        />
        <button className={css.confirmBtn} onClick={confirmBalance}>
          ПІДТВЕРДИТИ
        </button>
        <BalanceHint balance={savedBalance} />
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
          <div className={css.btns}>
            <button className={css.primaryBtn} onClick={addTransaction}>
              ВВЕСТИ
            </button>
            <button className={css.secondaryBtn} onClick={clearForm}>
              ОЧИСТИТИ
            </button>
          </div>
        </div>

        <Transactions
          transactions={transactions}
          type={type}
          onDelete={askDelete}
        />

        {deleteId && (
          <ConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />
        )}
      </div>
        </>
      )}
    </div>
  );
}
