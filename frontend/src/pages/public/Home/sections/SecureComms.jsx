import React from "react";
import styles from "./SecureComms.module.css";
import { CasePin } from "../../../../components/caseboard/CaseBoard";

const ICONS = {
  envelope: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <path d="M3.5 6.5 L12 13 L20.5 6.5" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3.5c-4.7 0-8.5 3.8-8.5 8.5 0 1.7.5 3.3 1.4 4.7L4 20.5l3.9-1c1.3.8 2.9 1.2 4.5 1.2 4.7 0 8.5-3.8 8.5-8.5s-3.7-8.7-8.9-8.7Z" />
      <path d="M9 10.5c0 3 2.5 5.5 5.5 5.5" strokeLinecap="round" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a9 9 0 0 0-2.8 17.6c.4.1.6-.2.6-.4v-1.7c-2.6.3-3.1-1.2-3.3-1.7-.1-.3-.6-1.1-1-1.3-.4-.2-.9-.7 0-.7.8 0 1.4.8 1.6 1.1.9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.7-1.4-2.5-.3-4-1.5-4-3.6 0-.8.3-1.5.7-2-.1-.3-.3-1.1.1-2.2 0 0 .9-.3 2.3.7a8 8 0 0 1 4.2 0c1.4-1 2.3-.7 2.3-.7.4 1.1.2 1.9.1 2.2.4.5.7 1.2.7 2 0 2.1-1.5 3.3-4 3.6.3.3.6.9.6 1.7v2c0 .2.2.5.6.4A9 9 0 0 0 12 3Z" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 3.5c1 0 1.9.6 2.3 1.6l.9 2.2c.3.7.1 1.6-.4 2.1l-1 1c1 2 2.6 3.7 4.6 4.7l1-1c.5-.5 1.4-.7 2.1-.4l2.2.9c1 .4 1.6 1.3 1.6 2.3v1.6c0 1.2-1 2.1-2.1 2C9.6 19.5 4.5 14.4 3.9 7.1 3.8 6 4.7 4.9 6 3.5Z" />
    </svg>
  ),
};

function CommCard({ icon, label, value, link, color, meta }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className={`${styles.stub} paperShadow`} style={{ "--stub-accent": color }}>
      <div className={styles.perforation} />
      <div className={styles.stubHeader}>
        <div className={styles.iconBox}>{ICONS[icon]}</div>
        <span className={`${styles.meta} ink`}>{meta}</span>
      </div>
      <div className={`${styles.label} ink`}>{label}</div>
      <div className={`${styles.value} ink`}>{value}</div>
      <div className={`${styles.action} ink`}>[ INITIATE_CONNECTION ]</div>
    </a>
  );
}

export default function SecureComms() {
  // Static/Fallback channels (Verified Professional Comms)
  const defaultComms = [
    {
      id: "email",
      icon: "envelope",
      label: "ENCRYPTED_EMAIL",
      value: "okumuraven@gmail.com",
      link: "mailto:okumuraven@gmail.com",
      color: "#c23b2c",
      meta: "AES-256_SECURE",
    },
    {
      id: "whatsapp",
      icon: "whatsapp",
      label: "SECURE_WHATSAPP",
      value: "+254 794 534 817",
      link: "https://wa.me/254794534817",
      color: "#3fae5c",
      meta: "END-TO-END_UPLINK",
    },
    {
      id: "github",
      icon: "github",
      label: "CODEBASE_STATION",
      value: "github.com/okumuraven",
      link: "https://github.com/okumuraven",
      color: "#4a3620",
      meta: "REPOSITORY_NODE_OPEN",
    },
    {
      id: "voice",
      icon: "phone",
      label: "VOICE_COMMS",
      value: "Okumu Raven [HQ]",
      link: "tel:+254794534817",
      color: "#2a7f9e",
      meta: "LOCAL_RELAY_ENABLE",
    },
  ];

  return (
    <section className={`${styles.section} deskBg`}>
      <div className={styles.container}>
        <div className={`${styles.headerTag} paperShadow`}>
          <CasePin id="comms" order={50} className={styles.pin} />
          <span className={`${styles.dot}`}></span>
          <span className="ink" style={{ fontSize: "11px", letterSpacing: "1px" }}>
            SYSTEM_READY // COMMS_HUB_ONLINE
          </span>
        </div>
        <h2 className={`${styles.title} display`}>SECURE COMMUNICATIONS</h2>
        <p className={`${styles.subtitle} bodyCopy`}>
          Direct channels for professional consultation, architectural scoping, and operational deployment.
        </p>

        <div className={styles.grid}>
          {defaultComms.map((comm) => (
            <CommCard key={comm.id} {...comm} />
          ))}
        </div>

        <div className={`${styles.signature} hand`}>Okumu Joseph — Okumu Raven</div>
        <div className={`${styles.copyright} ink`}>© 2026 // CASE_STATUS: ACTIVE</div>
      </div>
    </section>
  );
}
