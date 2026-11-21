import { useEffect } from "react";
import {
  useGetHintSeenQuery,
  useSaveHintSeenMutation,
} from "@/redux/Tracker/trackerApi";

import "./BalanceHint.css";

export default function BalanceHint({ balance, userId }) {
  const { data: hintSeen, isLoading } = useGetHintSeenQuery(userId, {
    skip: !userId,
  });

  const [saveHintSeen] = useSaveHintSeenMutation();

  useEffect(() => {
    if (balance > 0 && hintSeen === false && userId) {
      saveHintSeen({ userId });
    }
  }, [balance, hintSeen, userId, saveHintSeen]);

  if (isLoading || !userId || hintSeen || balance > 0) {
    return null;
  }

  return (
    <div className="balance-hint">
      <p>Привіт! Для початку роботи внесіть свій поточний баланс рахунку!</p>
      <small>Ви не можете витрачати гроші, поки їх у Вас немає :)</small>
    </div>
  );
}