import "./App.css";
import { Route, Routes } from "react-router";
import Welcome from "./components/Welcome/welcome";
import { RestrictedRoute } from "./components/Routing/restrictedRoute";

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<RestrictedRoute component={<Welcome/>} navigateTo="/"/>} />
        </Routes>
      </div>


   </>
  );
}

export default App;
