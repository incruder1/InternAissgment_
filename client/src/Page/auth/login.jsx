import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';
import './authPage.styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/login", { email, password });
      console.log(res);

      if (res && res.data.success) {
        toast.success(res.data && res.data.message,{position: "bottom-center"});
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate("/connect");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong",{position: "bottom-center"});
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br /><label >
            <div id='check-box'>
              <input
                id="my-checkbox"
                type="checkbox"
                required
              /> Remember me
            </div>
          </label>
          <br />
          <button type="submit" className="auth-button">
            Login
          </button>

        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>


    </div>
  );
};

export default Login;
