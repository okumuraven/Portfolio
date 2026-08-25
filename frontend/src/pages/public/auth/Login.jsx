// src/pages/public/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import '../../../styles/dossier.css';
import Seo from '../../../components/seo/Seo';
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
    <div className={`${styles.container} corkGrid`}>
      <Seo
        title="Restricted Access — Okumu Raven Admin"
        description="Admin sign-in."
        path="/auth/login"
        noindex
      />
      <div className={styles.cardWrap}>
        <span className={`${styles.tack} pin`} />
        <span className={`${styles.tack} ${styles.tackRight} pin`} />

        <svg className={styles.string} viewBox="0 0 440 460" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 14 14 L 372 44" />
        </svg>

        <svg className={styles.paperclip} viewBox="0 0 24 48" aria-hidden="true">
          <path
            d="M6 10 V34 a6 6 0 0 0 12 0 V8 a4 4 0 0 0-8 0 V30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>

        <div className={`${styles.loginCard} paperShadow`}>
          <span className={styles.punchHole} />
          <span className={`${styles.punchHole} ${styles.punchHole2}`} />
          <span className={`${styles.punchHole} ${styles.punchHole3}`} />

          <div className={styles.folderTab}>
            <span className="ink">CASE FILE // ADMIN-001</span>
          </div>

          <div className={styles.stamp}>
            <span>RESTRICTED</span>
          </div>

          {/* Header Section */}
          <div className={styles.header}>
            <p className={styles.eyebrow}>
              <span className={styles.reticle} aria-hidden="true" />
              <span className="ink">{show2FA ? 'STEP 02 // MFA_VERIFICATION' : 'STEP 01 // IDENTITY_CHECK'}</span>
              <span className={styles.cursor} aria-hidden="true" />
            </p>
            <h2 className={`${styles.title} display`}>
              {show2FA ? 'Security Challenge' : 'Restricted Access'}
            </h2>
            <p className={`${styles.subtitle} bodyCopy`}>
              {show2FA
                ? 'A one-time code has been requested to confirm your identity.'
                : 'Authorized personnel only. All attempts are logged.'}
            </p>
          </div>

          {!show2FA ? (
            <form onSubmit={handleFirstStep}>
              {/* Email Input */}
              <div className={styles.inputGroup}>
                <label className={`${styles.label} ink`}>USER_ID / EMAIL</label>
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
                <label className={`${styles.label} ink`}>PASSCODE</label>
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
                <span className={styles.btnIcon} aria-hidden="true" />
                {loading ? 'VERIFYING…' : 'INITIALIZE SESSION'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSecondStep}>
              {/* 2FA Input */}
              <div className={styles.inputGroup}>
                <label className={`${styles.label} ink`}>SECURITY_CODE [TOTP]</label>
                <input
                  className={`${styles.inputField} ${styles.codeField}`}
                  type="text"
                  maxLength="6"
                  value={twoFactorCode}
                  required
                  autoFocus
                  onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="XXXXXX"
                  autoComplete="one-time-code"
                />
                <p className={`${styles.helpText} bodyCopy`}>Enter the 6-digit code from your authenticator app, or a recovery code.</p>
              </div>

              {/* Action Button */}
              <button className={styles.submitBtn} disabled={loading}>
                <span className={styles.btnIcon} aria-hidden="true" />
                {loading ? 'VALIDATING…' : 'VERIFY CODE'}
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
              <span className="ink">[ACCESS DENIED]</span> {err}
            </div>
          )}

          <p className={styles.footNote}>
            <span className="ink">{'// this terminal is monitored — unauthorized access is a federal offense'}</span>
            <span className={styles.footNoteDivider}>·</span>
            <span className="ink">TRANSMISSION ENCRYPTED</span>
          </p>
        </div>
      </div>
    </div>
  );
}
