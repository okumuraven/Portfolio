// src/pages/admin/Login/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, login2FA } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [userId, setUserId] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFirstStep = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.error) {
        setErr(data.error);
      } else if (data.twoFactorRequired) {
        setShow2FA(true);
        setUserId(data.userId);
      } else {
        navigate('/admin');
      }
    } catch (error) {
      setErr(error?.response?.data?.error ?? 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSecondStep = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const data = await login2FA(userId, twoFactorCode);
      if (data.error) {
        setErr(data.error);
      } else {
        navigate('/admin');
      }
    } catch (error) {
      setErr(error?.response?.data?.error ?? '2FA verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        
        {/* Header Section */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {show2FA ? "Security Challenge" : "Restricted Access"}
          </h2>
          <p className={styles.subtitle}>
            {show2FA ? "STEP 02: MFA_VERIFICATION" : "STEP 01: IDENTITY_CHECK"}
          </p>
        </div>

        {!show2FA ? (
          <form onSubmit={handleFirstStep}>
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
          </form>
        ) : (
          <form onSubmit={handleSecondStep}>
            {/* 2FA Input */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>SECURITY_CODE [TOTP]</label>
              <input
                className={styles.inputField}
                type="text"
                maxLength="6"
                value={twoFactorCode}
                required
                autoFocus
                onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                placeholder="XXXXXX"
                autoComplete="one-time-code"
              />
              <p className={styles.helpText}>Enter the 6-digit code from your authenticator app.</p>
            </div>

            {/* Action Button */}
            <button className={styles.submitBtn} disabled={loading}>
              {loading ? "VALIDATING..." : "VERIFY CODE"}
            </button>
            
            <button 
              type="button" 
              className={styles.backBtn} 
              onClick={() => setShow2FA(false)}
              disabled={loading}
            >
              &larr; BACK TO LOGIN
            </button>
          </form>
        )}

        {/* Error Display */}
        {err && (
          <div className={styles.errorMsg}>
            [ERROR]: {err}
          </div>
        )}
      </div>
    </div>
  );
}