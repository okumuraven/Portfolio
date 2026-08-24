import React from "react";
import styles from "./SecurityCaseFile.module.css";

/**
 * SecurityCaseFile — the detective-corkboard treatment for the
 * Cyber Security persona: redacted photo, clearance card, location
 * tag and TryHackMe certificate, connected by red string on desktop.
 * Collapses to a plain stacked column on narrow screens.
 */
export default function SecurityCaseFile() {
  return (
    <section className={`${styles.section} deskBg`}>
      <div className={`${styles.board} corkGrid`}>
        <div className={`${styles.boardLabel} paperShadow ink`}>CASE FILE // CYBER_SECURITY</div>

        <svg className={styles.strings} viewBox="0 0 1260 820" preserveAspectRatio="none" aria-hidden="true">
          <path d="M175 195 Q300 150 450 255" className={styles.string} />
          <path d="M450 255 Q580 200 750 155" className={styles.string} />
          <path d="M750 155 Q950 130 1130 170" className={styles.string} />
          <path d="M450 255 Q320 350 195 440" className={styles.string} />
          <path d="M195 440 Q300 460 405 470" className={styles.string} />
          <path d="M1130 170 Q1000 330 865 485" className={styles.string} />
          <circle cx="175" cy="195" r="5" className={styles.pinDot} />
          <circle cx="450" cy="255" r="5" className={styles.pinDot} />
          <circle cx="750" cy="155" r="5" className={styles.pinDot} />
          <circle cx="1130" cy="170" r="5" className={styles.pinDot} />
          <circle cx="195" cy="440" r="5" className={styles.pinDot} />
          <circle cx="405" cy="470" r="5" className={styles.pinDot} />
          <circle cx="865" cy="485" r="5" className={styles.pinDot} />
        </svg>

        <div className={`${styles.mugshot} paperShadow`}>
          <div className={styles.mugshotPhoto}>
            <svg viewBox="0 0 100 120" className={styles.silhouette}>
              <circle cx="50" cy="34" r="24" fill="#000" />
              <path d="M16 118 Q12 72 50 68 Q88 72 84 118 Z" fill="#000" />
            </svg>
          </div>
          <div className={`${styles.mugshotCaption} ink`}>ID// SR-02 · REDACTED</div>
        </div>

        <div className={`${styles.clearance} paperShadow`}>
          <div className={`${styles.clearanceHeader} ink`}>REPUBLIC OF OPERATIONS</div>
          <div className={`${styles.clearanceTitle} ink`}>CLEARANCE: SOC LEVEL 1</div>
          <div className={`${styles.seal} ink`}>OWASP<br />CERT</div>
          <div className={`${styles.clearanceFooter} bodyCopy`}>Burp Suite · Kali Linux</div>
        </div>

        <div className={`${styles.locationCard} paperShadow ink`}>
          OPERATING FROM — <span className={styles.circled}>KENYA // GLOBAL</span>
        </div>

        <div className={`${styles.certificate} torn paperShadow`}>
          <svg viewBox="0 0 24 44" className={styles.paperclip} aria-hidden="true">
            <path d="M8 6 Q8 2 12 2 Q18 2 18 8 L18 30 Q18 36 12 36 Q8 36 8 32 L8 14 Q8 11 11 11 Q14 11 14 14 L14 27" fill="none" stroke="#9a9a9a" strokeWidth="2.4" />
          </svg>
          <div className={`${styles.certLabel} ink`}>TRYHACKME // PRE-SECURITY CERTIFICATION</div>
          <div className={styles.certHighlightWrap}>
            <span className={styles.certCircle} />
            <span className={`${styles.certHighlight} display`}>TOP 9% GLOBALLY</span>
          </div>
          <div className={`${styles.certFooter} bodyCopy`}>55+ rooms secured · continuing Cyber Security 101</div>
        </div>

        <div className={styles.stickyRow}>
          <div className={`${styles.sticky} hand`}>Kali Linux</div>
          <div className={`${styles.sticky} hand`}>Burp Suite</div>
          <div className={`${styles.sticky} hand`}>OWASP Top 10</div>
          <div className={`${styles.sticky} hand`}>Network Telemetry Analysis</div>
        </div>

        <div className={`${styles.bottomTag} paperShadow`}>
          <div className={`${styles.bottomTagTitle} display`}>THE RESEARCHER STRIKES AGAIN</div>
          <div className={`${styles.bottomTagStatus} ink`}>case status: ongoing</div>
        </div>
      </div>
    </section>
  );
}
