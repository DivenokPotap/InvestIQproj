import "./App.css";
import { Route, Routes } from "react-router";
import Welcome from "./components/Welcome/welcome";
import { RestrictedRoute } from "./components/Routing/restrictedRoute";
import Tracker from "./components/Tracker/Tracker";

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<RestrictedRoute component={<Welcome/>} navigateTo="/"/>} />
        </Routes>
        <Tracker />
      </div>


   </>
  );
}

export default App;
