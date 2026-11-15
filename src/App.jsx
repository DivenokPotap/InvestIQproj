import "./App.css";
import { Route, Routes } from "react-router";
import Welcome from "./components/Welcome/welcome";
import { RestrictedRoute } from "./components/Routing/restrictedRoute";
import { PrivateRoute } from "./components/Routing/privateRoute";
import Header from "./components/Header/Header";
import Tracker from "./components/Tracker/Tracker";
import { useOnAuthChangeQuery } from "./redux/Auth/authApi";

function App() {
  useOnAuthChangeQuery();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RestrictedRoute component={<Welcome />} navigateTo="/tracker" />
        }
      />
      <Route
        path="/tracker"
        element={
          <PrivateRoute
            component={
              <>
                <Header />
                <Tracker />
              </>
            }
            navigateTo="/"
          />
        }
      />
    </Routes>
  );
}

export default App;
