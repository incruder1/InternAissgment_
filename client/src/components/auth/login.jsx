import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './authPage.styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://internassigment.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jwtToken', data.token);
        setShowPopup(true);
        setMessage(data.message);
      } else {
        const messageData = await response.json();
        setMessage(messageData.message || 'Authentication failed');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Internal Server Error');
      setShowPopup(true);
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
                // checked={checked}
                // onChange={handleChange}
                required
              /> Remember me
            </div>
          </label>
          <br />
          {message && <p className="error-message">{message}</p>}
          <button type="submit" className="auth-button">
            Login
          </button>

        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{message}</p>
            <button onClick={() => { setShowPopup(false); if (message === "login successfully") { navigate('/connect') } }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
