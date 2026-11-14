import { useState } from "react";
import css from "./ExpenseStats.module.css";

import products from "../../assets/Group_62.svg";
import alcohol from "../../assets/cocktail_1.svg";
import fun from "../../assets/kite_1.svg";
import health from "../../assets/hands-holding-heart_1.svg";
import transport from "../../assets/car_1.svg";
import home from "../../assets/couch_1.svg";
import tech from "../../assets/tools_1.svg";
import utilities from "../../assets/Group.svg";
import sport from "../../assets/clay_1.svg";
import education from "../../assets/book_1.svg";
import other from "../../assets/ufo_1.svg";

// name — как в Tracker.jsx, label — подпись из макета, icon — картинка из assets
const CATEGORY_LIST = [
  { name: "Продукти", label: "ПРОДУКТИ", icon: products },
  { name: "Алкоголь", label: "АЛКОГОЛЬ", icon: alcohol },
  { name: "Розваги", label: "РОЗВАГИ", icon: fun },
  { name: "Здоров'я", label: "ЗДОРОВ'Я", icon: health },
  { name: "Транспорт", label: "ТРАНСПОРТ", icon: transport },
  { name: "Все для дому", label: "ВСЕ ДЛЯ ДОМУ", icon: home },
  { name: "Техніка", label: "ТЕХНІКА", icon: tech },
  { name: "Комуналка", label: "КОМУНАЛКА, ЗВ'ЯЗОК", icon: utilities },
  { name: "Спорт", label: "СПОРТ, ХОБІ", icon: sport },
  { name: "Освіта", label: "НАВЧАННЯ", icon: education },
  { name: "Інше", label: "ІНШЕ", icon: other },
];

const MONTHS = [
  "СІЧЕНЬ", "ЛЮТИЙ", "БЕРЕЗЕНЬ", "КВІТЕНЬ", "ТРАВЕНЬ", "ЧЕРВЕНЬ",
  "ЛИПЕНЬ", "СЕРПЕНЬ", "ВЕРЕСЕНЬ", "ЖОВТЕНЬ", "ЛИСТОПАД", "ГРУДЕНЬ",
];

const MAX_BARS = 10;

const fmt = value =>
  value.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function ExpenseStats({ transactions }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState("Продукти");

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

  const monthExpenses = transactions.filter(tx => {
    if (tx.type !== "expense") return false;
    const [, m, y] = tx.date.split(".");
    return Number(m) - 1 === month && Number(y) === year;
  });

  const totals = {};
  monthExpenses.forEach(tx => {
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
  });

  const byDescription = {};
  monthExpenses
    .filter(tx => tx.category === selected)
    .forEach(tx => {
      const key = tx.description.trim();
      byDescription[key] = (byDescription[key] || 0) + tx.amount;
    });

  const bars = Object.entries(byDescription)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_BARS);

  const maxValue = bars.length ? bars[0][1] : 0;
  const selectedLabel =
    CATEGORY_LIST.find(c => c.name === selected)?.label ?? selected;

  const firstRow = CATEGORY_LIST.slice(0, 6);
  const secondRow = CATEGORY_LIST.slice(6);

  const renderCategory = ({ name, label, icon }) => (
    <button
      key={name}
      type="button"
      className={`${css.category} ${selected === name ? css.categoryActive : ""}`}
      onClick={() => setSelected(name)}
    >
      <span className={css.catSum}>{fmt(totals[name] || 0)}</span>
      <span className={css.catIcon}>
        <img src={icon} alt={label} />
      </span>
      <span className={css.catLabel}>{label}</span>
    </button>
  );

  return (
    <div className={css.stats}>
      <div className={css.block}>
        <div className={css.monthNav}>
          <button
            type="button"
            className={css.arrow}
            onClick={() => shiftMonth(-1)}
            aria-label="Попередній місяць"
          >
            ‹
          </button>
          <h3 className={css.monthTitle}>
            ВИТРАТИ · {MONTHS[month]} {year}
          </h3>
          <button
            type="button"
            className={css.arrow}
            onClick={() => shiftMonth(1)}
            aria-label="Наступний місяць"
          >
            ›
          </button>
        </div>
        <div className={css.row}>{firstRow.map(renderCategory)}</div>
        <div className={css.row}>{secondRow.map(renderCategory)}</div>
      </div>

      <div className={css.block}>
        <h3 className={css.chartTitle}>{selectedLabel}</h3>
        {bars.length === 0 ? (
          <p className={css.empty}>Немає витрат у цій категорії за обраний місяць</p>
        ) : (
          <div className={css.chart}>
            {bars.map(([name, value], index) => (
              <div key={name} className={css.barCol}>
                <span className={css.barValue}>
                  {value.toLocaleString("uk-UA", { maximumFractionDigits: 2 })} грн
                </span>
                <div className={css.barTrack}>
                  <div
                    className={`${css.bar} ${index % 3 === 0 ? css.barDark : css.barLight}`}
                    style={{ height: `${(value / maxValue) * 100}%` }}
                  />
                </div>
                <span className={css.barName} title={name}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
