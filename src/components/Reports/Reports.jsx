import { useState } from "react";
import css from "./Reports.module.css";
import ExpenseStats from "../ExpenseStats/ExpenseStats";
import { MONTHS } from "@/constants";

const fmt = value =>
  value.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function Reports({ balance, transactions, onBack }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth()); 
  const [year, setYear] = useState(now.getFullYear());
  const [type, setType] = useState("expense"); 

  const shiftMonth = step => {
    const next = month + step;
    if (next < 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else if (next > 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(next);
    }
  };

  const toggleType = () => setType(prev => (prev === "expense" ? "income" : "expense"));

 
  const sumFor = kind =>
    transactions
      .filter(tx => {
        if (tx.type !== kind) return false;
        const [, m, y] = tx.date.split(".");
        return Number(m) - 1 === month && Number(y) === year;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

  const expenses = sumFor("expense");
  const income = sumFor("income");

  return (
    <div className={css.reports}>
      <div className={css.header}>
        <button type="button" className={css.back} onClick={onBack}>
          <span className={css.backArrow}>←</span>
          Повернутись на головну
        </button>

        <div className={css.balanceBox}>
          <span className={css.label}>Баланс:</span>
          <span className={css.balance}>{balance.toFixed(2)} UAH</span>
        </div>

        <div className={css.period}>
          <span className={css.periodLabel}>Поточний період</span>
          <div className={css.periodNav}>
            <button
              type="button"
              className={css.arrow}
              onClick={() => shiftMonth(-1)}
              aria-label="Попередній місяць"
            >
              ‹
            </button>
            <span className={css.periodValue}>
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              className={css.arrow}
              onClick={() => shiftMonth(1)}
              aria-label="Наступний місяць"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className={css.summary}>
        <span className={css.summaryItem}>
          Витрати: <b className={css.expense}>- {fmt(expenses)} грн.</b>
        </span>
        <span className={css.divider} />
        <span className={css.summaryItem}>
          Доходи: <b className={css.income}>+ {fmt(income)} грн.</b>
        </span>
      </div>

      <ExpenseStats
        transactions={transactions}
        month={month}
        year={year}
        type={type}
        onTypeChange={toggleType}
      />
    </div>
  );
}
