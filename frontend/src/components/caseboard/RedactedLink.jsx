import React from "react";
import styles from "./RedactedLink.module.css";

/**
 * RedactedLink — a case-tab link that starts blacked out like a
 * declassified document. Hovering/focusing slides the redaction bar
 * away to reveal the real label underneath, the way a detective would
 * peel back a censor bar on a file.
 */
export default function RedactedLink({ href, children, stamp = "CLASSIFIED", target, rel }) {
  return (
    <a href={href} target={target} rel={rel} className={`${styles.tab} ink`}>
      <svg className={styles.magnifier} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="10" cy="10" r="6" />
        <line x1="14.5" y1="14.5" x2="20" y2="20" />
      </svg>
      <span className={styles.label}>{children}</span>
      <span className={styles.redaction} aria-hidden="true">{stamp}</span>
    </a>
  );
}
