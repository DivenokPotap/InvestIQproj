import { useEffect } from "react";
import css from "./ConfirmModal.module.css";

export default function ConfirmModal({ onConfirm, onCancel, text = "Ви впевнені?" }) {
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
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <p className={css.text}>{text}</p>

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