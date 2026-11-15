import { useEffect } from "react";
import css from "./ConfirmModal.module.css";

export default function ConfirmModal({ onConfirm, onCancel }) {
  useEffect(() => {
    const handleKey = e => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div className={css.backdrop} onClick={onCancel}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <button className={css.close} onClick={onCancel} aria-label="Закрити">
        </button>

        <p className={css.text}>Ви впевнені?</p>

        <div className={css.buttons}>
          <button className={css.yes} onClick={onConfirm}>
            Так
          </button>
          <button className={css.no} onClick={onCancel}>
            Ні
          </button>
        </div>
      </div>
    </div>
  );
}