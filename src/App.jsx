import "./App.css";
import { Route, Routes } from "react-router";
import Welcome from "./components/Welcome/welcome";
import { RestrictedRoute } from "./components/Routing/RestrictedRoute";
import Tracker from "./components/Tracker/Tracker";
import { useOnAuthChangeQuery} from "./redux/Auth/authApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearAuth, setAuth } from "./redux/Auth/authSlice";
import { PrivateRoute } from "./components/Routing/PrivateRoute";

function App() {
  const dispatch = useDispatch();

  const { data: user } = useOnAuthChangeQuery();

  useEffect(() => {
    if (user === undefined) return;

    if (user) {
      dispatch(setAuth(user));
    } else {
      dispatch(clearAuth());
    }
  }, [user, dispatch]);

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<RestrictedRoute component={<Welcome />} navigateTo="/transactionBoard" />} />
          <Route path="/transactionBoard" element={<PrivateRoute component={<Tracker />} navigateTo="/"/>} />
        </Routes>
      </div>
   </>
  );
}

export default App;
