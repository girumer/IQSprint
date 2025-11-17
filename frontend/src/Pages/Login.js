import React, { useState } from 'react';
import axios from 'axios';
import gameBack from "../assets/loginback.png";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [form, setForm] = useState({ phoneNumber: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Get the login function from AuthContext

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKENDURL}/api/login`, form);

      alert('Login successful!');
      const { user, token } = res.data;

      // ✅ USE THE AUTHCONTEXT LOGIN FUNCTION INSTEAD OF MANUAL localStorage
      login(user, token);

      // ✅ Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/GameTabs');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form" style={{
      backgroundImage: `url(${gameBack})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
   
      <p>
        Welcome to ThinkUp IQ Sprint: Game-Based Analytical System, Logic Challenges & Language Mastery.
        First three days are free, then 3 birr per day.
      </p>

      <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>

      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </form>
  );
}

export default Login;