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
import salarySvg from "../../assets/salary.svg";
import extraSvg from "../../assets/extra.svg";

const img = src => <img src={src} alt="" />;

const salaryIcon = <img src={salarySvg} width={44} height={44} alt="" />;
const extraIcon = <img src={extraSvg} width={44} height={44} alt="" />;


const CATEGORY_LIST = {
  expense: [
    { name: "Продукти", label: "ПРОДУКТИ", icon: img(products) },
    { name: "Алкоголь", label: "АЛКОГОЛЬ", icon: img(alcohol) },
    { name: "Розваги", label: "РОЗВАГИ", icon: img(fun) },
    { name: "Здоров'я", label: "ЗДОРОВ'Я", icon: img(health) },
    { name: "Транспорт", label: "ТРАНСПОРТ", icon: img(transport) },
    { name: "Все для дому", label: "ВСЕ ДЛЯ ДОМУ", icon: img(home) },
    { name: "Техніка", label: "ТЕХНІКА", icon: img(tech) },
    { name: "Комуналка", label: "КОМУНАЛКА, ЗВ'ЯЗОК", icon: img(utilities) },
    { name: "Спорт", label: "СПОРТ, ХОБІ", icon: img(sport) },
    { name: "Освіта", label: "НАВЧАННЯ", icon: img(education) },
    { name: "Інше", label: "ІНШЕ", icon: img(other) },
  ],
  income: [
    { name: "Зарплата", label: "ЗАРПЛАТА", icon: salaryIcon },
    { name: "Додатковий дохід", label: "ДОД. ПРИБУТОК", icon: extraIcon },
  ],
};

const TITLES = { expense: "ВИТРАТИ", income: "ДОХІД" };
const EMPTY = {
  expense: "Немає витрат у цій категорії за обраний місяць",
  income: "Немає доходів у цій категорії за обраний місяць",
};

const MAX_BARS = 10;

const fmt = value =>
  value.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });


export default function ExpenseStats({
  transactions,
  month,
  year,
  type,
  onTypeChange,
}) {

  const [selectedByType, setSelectedByType] = useState({
    expense: "Продукти",
    income: "Зарплата",
  });
  const selected = selectedByType[type];
  const selectCategory = name =>
    setSelectedByType(prev => ({ ...prev, [type]: name }));

  const categories = CATEGORY_LIST[type];

  const monthItems = transactions.filter(tx => {
    if (tx.type !== type) return false;
    const [, m, y] = tx.date.split(".");
    return Number(m) - 1 === month && Number(y) === year;
  });

  const totals = {};
  monthItems.forEach(tx => {
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
  });


  const byDescription = {};
  monthItems
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
    categories.find(c => c.name === selected)?.label ?? selected;

  const rows =
    type === "expense" ? [categories.slice(0, 6), categories.slice(6)] : [categories];

  const renderCategory = ({ name, label, icon }) => (
    <button
      key={name}
      type="button"
      className={`${css.category} ${selected === name ? css.categoryActive : ""}`}
      onClick={() => selectCategory(name)}
    >
      <span className={css.catSum}>{fmt(totals[name] || 0)}</span>
      <span className={css.catIcon}>{icon}</span>
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
            onClick={onTypeChange}
            aria-label="Перемкнути витрати та доходи"
          >
            ‹
          </button>
          <h3 className={css.monthTitle}>{TITLES[type]}</h3>
          <button
            type="button"
            className={css.arrow}
            onClick={onTypeChange}
            aria-label="Перемкнути витрати та доходи"
          >
            ›
          </button>
        </div>
        {rows.map((row, i) => (
          <div key={i} className={css.row}>
            {row.map(renderCategory)}
          </div>
        ))}
      </div>

      <div className={css.block}>
        <h3 className={css.chartTitle}>{selectedLabel}</h3>
        {bars.length === 0 ? (
          <p className={css.empty}>{EMPTY[type]}</p>
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
