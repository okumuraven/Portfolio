// src/pages/admin/Login/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './LoginPage.module.css'; // Import the new styles

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.error) {
        setErr(data.error);
      } else {
        navigate('/admin');
      }
    } catch (error) {
      setErr(error?.response?.data?.error ?? 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        
        {/* Header Section */}
        <div className={styles.header}>
          <h2 className={styles.title}>Restricted Access</h2>
          <p className={styles.subtitle}>{/* AUTHENTICATION_REQUIRED */}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>USER_ID / EMAIL</label>
            <input
              className={styles.inputField}
              type="email"
              value={email}
              required
              autoFocus
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@system.com"
            />
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>PASSCODE</label>
            <input
              className={styles.inputField}
              type="password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* Action Button */}
          <button className={styles.submitBtn} disabled={loading}>
            {loading ? "VERIFYING..." : "INITIALIZE SESSION"}
          </button>

          {/* Error Display */}
          {err && (
            <div className={styles.errorMsg}>
              [ERROR]: {err}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}