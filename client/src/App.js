import { Routes, Route, useNavigate } from "react-router-dom";
import FBConnectPage from "./components/FBConnectPage";
import Helpdesk from "./components/Helpdesk";
import Login from "./components/auth/login";
import { Toaster } from "react-hot-toast"; 
import SignUp from "./components/auth/signup";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
        <Route path="/connect" element={<FBConnectPage />} />
        <Route path="/helpdesk" element={<Helpdesk />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
