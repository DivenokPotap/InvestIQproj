
import { useAuth } from "@/redux/Auth/useAuh";
import { Outlet } from "react-router";
import Header from "../Header/Header";


export const Layout = () => {
    const { isLoggedIn } = useAuth();
  return (
    <>
        {isLoggedIn &&  <Header /> }
      <Outlet />
    </>
  );
};