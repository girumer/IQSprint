import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import AuthLayout from './AuthLayout';
import { useToast } from '../components/Toast';
import { API_BASE } from '../api';

const PHONE_PATTERN = /^0[79]\d{8}$/;

function Signup() {
  const [form, setForm] = useState({ phoneNumber: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneNumber = form.phoneNumber.trim();

    if (!PHONE_PATTERN.test(phoneNumber)) {
      toast.error('Enter a 10-digit phone number that starts with 09 or 07.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Use a password with at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('The two passwords don’t match.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/api/register`, { phoneNumber, password: form.password });
      toast.success('Account created. Log in to start playing.');
      navigate('/login', { state: { phoneNumber } });
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
    <AuthLayout title="Create your account" subtitle="Your first three days are free, then 3 birr per day.">
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
            maxLength={10}
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
              autoComplete="new-password"
              placeholder="At least 6 characters"
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

        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            className="input"
            name="confirm"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Type it again"
            value={form.confirm}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Signup;
