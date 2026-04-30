import React, { useState, useEffect } from 'react';
import styles from './TerminalLoader.module.css';

const MESSAGES = [
  "INITIATING SECURE HANDSHAKE...",
  "BYPASSING FIREWALL...",
  "DECRYPTING DOSSIER...",
  "ACCESS GRANTED."
];

/**
 * TerminalLoader - A themed "UX Decoy" loading sequence.
 * 
 * It plays a terminal-style animation of lines being typed out.
 * Useful for masking cold starts or database wake-up delays.
 * 
 * @param {Function} onComplete - Callback when animation finishes.
 */
const TerminalLoader = ({ onComplete }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < MESSAGES.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, MESSAGES[index]]);
        setIndex(prev => prev + 1);
      }, 600); // Delay between each line
      return () => clearTimeout(timer);
    } else {
      // Small pause after the last message before signaling completion
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [index, onComplete]);

  return (
    <div className={styles.overlay}>
      <div className={styles.terminal}>
        <div className={styles.header}>
          <div className={styles.buttons}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <span className={styles.title}>SESSION_INIT.sh</span>
        </div>
        <div className={styles.content}>
          {visibleMessages.map((msg, i) => (
            <div key={i} className={styles.line}>
              <span className={styles.prompt}>&gt;</span> {msg}
            </div>
          ))}
          {index < MESSAGES.length && (
            <div className={styles.cursor} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalLoader;
