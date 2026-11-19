import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Login.css';
import AuthLayout from './AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { API_BASE } from '../api';

function Login() {
  const location = useLocation();
  const [form, setForm] = useState({
    phoneNumber: location.state?.phoneNumber || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/api/login`, {
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
      });
      const { user, token } = res.data;
      login(user, token);
      toast.success('Welcome back! Your puzzles are ready.');
      navigate(user.role === 'admin' ? '/admin' : '/GameTabs');
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          'Could not reach the server. Check your internet connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Log in" subtitle="Pick up where you left off and keep your streak going.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="phoneNumber">Phone number</label>
          <input
            id="phoneNumber"
            className="input"
            name="phoneNumber"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="09xxxxxxxx"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              id="password"
              className="input"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-switch">
          New to IQsprint? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
