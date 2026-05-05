import React, { useState, useEffect } from 'react';
import styles from './InlineTacticalLoader.module.css';

const TACTICAL_MESSAGES = [
  "ANALYZING THREAT VECTORS...",
  "QUERYING SECURE DATABASE...",
  "INITIALIZING NEURAL REDIRECTION...",
  "CALCULATING PROBABILITIES...",
  "SYNTHESIZING EXPERT ADVICE...",
  "ESTABLISHING SECURE HANDSHAKE...",
  "PROCESSING TELEMETRY...",
  "DECRYPTING RESPONSE STREAM...",
  "BYPASSING COGNITIVE BIAS...",
  "MAPPING BEHAVIORAL PATTERNS..."
];

const InlineTacticalLoader = ({ message }) => {
  const [displayText, setDisplayText] = useState(message || TACTICAL_MESSAGES[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Message cycling
    if (!message) {
      const interval = setInterval(() => {
        setDisplayText(prev => {
          const currentIndex = TACTICAL_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % TACTICAL_MESSAGES.length;
          return TACTICAL_MESSAGES[nextIndex];
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [message]);

  useEffect(() => {
    // Simulated progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) return 98; // Stay near 100 but don't finish
        return prev + Math.random() * 5;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.inlineLoaderContainer}>
      <div className={styles.inlineLoader}>
        <div className={styles.scannerWrapper}>
          <span className={styles.spinner} />
          <div className={styles.scanningLine} />
        </div>
        <div className={styles.textStack}>
          <span className={styles.mainText}>{displayText}</span>
          <span className={styles.subText}>SECURE_PROTOCOL_ACTIVE {" // "} v1.0.4</span>
        </div>
      </div>
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        <span className={styles.progressValue}>{Math.floor(progress)}%</span>
      </div>
    </div>
  );
};

export default InlineTacticalLoader;
