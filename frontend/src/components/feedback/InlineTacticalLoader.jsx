import React, { useState, useEffect } from 'react';
import styles from './InlineTacticalLoader.module.css';

const TACTICAL_MESSAGES = [
  "ANALYZING THREAT VECTORS...",
  "QUERYING SECURE DATABASE...",
  "INITIALIZING NEURAL REDIRECTION...",
  "CALCULATING PROBABILITIES...",
  "SYNTHESIZING EXPERT ADVICE...",
  "ESTABLISHING SECURE HANDSHAKE...",
  "PROCESSING TELEMETRY..."
];

const InlineTacticalLoader = ({ message }) => {
  const [displayText, setDisplayText] = useState(message || TACTICAL_MESSAGES[0]);

  useEffect(() => {
    if (message) return; // If a static message is passed, don't cycle

    const interval = setInterval(() => {
      const randomMsg = TACTICAL_MESSAGES[Math.floor(Math.random() * TACTICAL_MESSAGES.length)];
      setDisplayText(randomMsg);
    }, 2000);

    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className={styles.inlineLoader}>
      <span className={styles.spinner} />
      <span>{displayText}</span>
    </div>
  );
};

export default InlineTacticalLoader;
