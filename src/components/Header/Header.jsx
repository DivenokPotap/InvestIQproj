import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/redux/Auth/useAuh";
import { useSignOutMutation } from "@/redux/Auth/authApi";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import logo from "@/assets/logo.svg";
import css from "./Header.module.css";

const getDisplayName = user => {
  if (!user) return "";
  return (
    user.displayName?.trim() ||
    user.email?.split("@")[0] ||
    "User"
  );
};

const Header = () => {
  const { user } = useAuth();
  const [signOut] = useSignOutMutation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const name = getDisplayName(user);
  const firstLetter = name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await signOut().unwrap();
      setIsModalOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className={css.header}>
      <div className={css.logo}>
        <img className={css.logoImg} src={logo} alt="InvestIQ logo" />
        <span className={css.logoText}>INVESTIQ</span>
      </div>

      <div className={css.user}>
        <div className={css.avatar}>{firstLetter}</div>
        <span className={css.userName}>{name}</span>
        <div className={css.divider} />
        <button
          type="button"
          className={css.logoutBtn}
          onClick={() => setIsModalOpen(true)}
        >
          Вийти
        </button>
      </div>
      {isModalOpen && (
        <ConfirmModal
          text="Ви дійсно хочете вийти?"
          onConfirm={handleLogout}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
