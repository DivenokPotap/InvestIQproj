import "./App.css";
import { useState } from "react";
import { Route, Routes } from "react-router";
import Welcome from "./components/Welcome/welcome";
import { RestrictedRoute } from "./components/Routing/RestrictedRoute";
import Tracker from "./components/Tracker/Tracker";
import { useOnAuthChangeQuery } from "./redux/Auth/authApi";

function App() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
   useOnAuthChangeQuery()
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<RestrictedRoute component={<Welcome/>} navigateTo="/"/>} />
        </Routes>
        <Tracker
          balance={balance}
          setBalance={setBalance}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      </div>


   </>
  );
}

export default App;
