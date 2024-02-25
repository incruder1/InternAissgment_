import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './authPage.styles.css';

import toast from "react-hot-toast";
import axios from 'axios';
const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post("http://localhost:8080/api/v1/auth/register", {
        email, password, name
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Create Account </h2>
        <form onSubmit={handleSignUp} className="auth-form">
          <label>
            Full Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <br />
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
          <br />
          <label >
            <div id='check-box'>
              <input  
                id="my-checkbox"
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                required
              /> Remember me
            </div>
          </label>
          <br />
          {message && <p className="error-message">{message}</p>}
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{message}</p>
            <button onClick={() => { setShowPopup(false); if (message == 'login successfully') { navigate("/connect") } }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
