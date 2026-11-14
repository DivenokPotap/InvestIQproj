import { useEffect, useState } from "react";
import "./BalanceHint.css";

export default function BalanceHint({ balance }) {
  const [visible, setVisible] = useState(
    () => !localStorage.getItem("hintSeen") && balance === 0,
  );

  useEffect(() => {
    localStorage.setItem("hintSeen", "true");
  }, []);

  useEffect(() => {
    if (balance > 0) setVisible(false);
  }, [balance]);

  if (!visible) return null;

  return (
    <div className="balance-hint">
      <p>Привіт! Для початку роботи внесіть свій поточний баланс рахунку!</p>
      <small>Ви не можете витрачати гроші, поки їх у Вас немає :)</small>
    </div>
  );
}