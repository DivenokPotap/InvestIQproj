import css from "./Transactions.module.css";

const ROWS_COUNT = 9;

const MONTHS = [
  "СІЧЕНЬ", "ЛЮТИЙ", "БЕРЕЗЕНЬ", "КВІТЕНЬ", "ТРАВЕНЬ", "ЧЕРВЕНЬ",
  "ЛИПЕНЬ", "СЕРПЕНЬ", "ВЕРЕСЕНЬ", "ЖОВТЕНЬ", "ЛИСТОПАД", "ГРУДЕНЬ",
];

export default function Transactions({ transactions, type, onDelete }) {
  const list = transactions.filter(item => item.type === type);
  const emptyCount = Math.max(ROWS_COUNT - list.length, 0);
  const byMonth = {};
  list.forEach(item => {
    const [, month, year] = item.date.split(".");
    const key = `${year}-${month}`;
    byMonth[key] = (byMonth[key] || 0) + item.amount;
  });

  const summary = Object.entries(byMonth).sort((a, b) =>
    b[0].localeCompare(a[0]),
  );

  const formatSum = value =>
    value.toLocaleString("uk-UA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className={css.wrap}>
      <div className={css.tableBox}>
        <table className={css.table}>
          <thead>
            <tr>
              <th>ДАТА</th>
              <th>ОПИС</th>
              <th className={css.center}>КАТЕГОРІЯ</th>
              <th className={css.center}>СУМА</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.description}</td>
                <td className={css.center}>{item.category}</td>
                <td
                  className={`${css.center} ${css.amount} ${
                    type === "expense" ? css.red : css.green
                  }`}
                >
                  {type === "expense" ? "-" : "+"} {item.amount.toFixed(2)} грн.
                </td>
                <td className={css.center}>
                  <button
                    className={css.deleteBtn}
                    onClick={() => onDelete(item.id)}
                    aria-label="Видалити"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v7M14 10v7" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {Array.from({ length: emptyCount }).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td colSpan={5}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={css.summary}>
        <h3 className={css.summaryTitle}>ЗВЕДЕННЯ</h3>
        <ul className={css.summaryList}>
          {summary.map(([key, sum]) => (
            <li key={key}>
              <span>{MONTHS[Number(key.split("-")[1]) - 1]}</span>
              <span>{formatSum(sum)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}