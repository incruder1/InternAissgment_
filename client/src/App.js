import { Routes, Route, useNavigate } from "react-router-dom";
import FBConnectPage from "./Page/FBConnectPage";
import Helpdesk from "./Page/Helpdesk";
import Login from "./Page/auth/login";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from "./Page/auth/signup";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer  />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/connect" element={<FBConnectPage />} />
        <Route path="/helpdesk" element={<Helpdesk />} />
      </Routes>
    </>
  );
}

export default App;
