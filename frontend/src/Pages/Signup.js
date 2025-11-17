import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import gameBack from "../assets/loginback.png";
import { useNavigate } from 'react-router-dom';
function Signup() {
  const [form, setForm] = useState({ phoneNumber: '', password: '' });
  const navigate = useNavigate();
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
console.log('Backend URL:', process.env.REACT_APP_BACKENDURL);
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKENDURL}/api/register`, form);
      alert('Signup successful!');
      navigate('/login'); // ✅ redirect to login page
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}className="login-form" style={{
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
      <button type="submit">Register</button>
    </form>
  );
}

export default Signup;
