// src/pages/public/Contact/SocialLinks.jsx
import React from "react";
import { CasePin } from "../../../components/caseboard/CaseBoard";
import styles from "./SocialLinks.module.css";

const ICONS = {
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <path d="M3.5 6.5 L12 13 L20.5 6.5" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 3.5c1 0 1.9.6 2.3 1.6l.9 2.2c.3.7.1 1.6-.4 2.1l-1 1c1 2 2.6 3.7 4.6 4.7l1-1c.5-.5 1.4-.7 2.1-.4l2.2.9c1 .4 1.6 1.3 1.6 2.3v1.6c0 1.2-1 2.1-2.1 2C9.6 19.5 4.5 14.4 3.9 7.1 3.8 6 4.7 4.9 6 3.5Z" />
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
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7.5" y1="10" x2="7.5" y2="17" />
      <circle cx="7.5" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-4.5c0-1.4 1-2.2 2.2-2.2s2.1.8 2.1 2.2V17" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4 L20 20 M20 4 L4 20" strokeLinecap="round" />
    </svg>
  ),
};

const META = {
  email: { icon: "email", meta: "AES-256_SECURE" },
  phone: { icon: "phone", meta: "LOCAL_RELAY_ENABLE" },
  whatsapp: { icon: "whatsapp", meta: "END-TO-END_UPLINK" },
  github: { icon: "github", meta: "REPOSITORY_NODE_OPEN" },
  linkedin: { icon: "linkedin", meta: "PROFESSIONAL_NODE" },
  twitter: { icon: "twitter", meta: "PUBLIC_FEED" },
};

// Receives: [{ field, value, type }, ...]
export default function SocialLinks({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={`${styles.headerTag} paperShadow`}>
        <CasePin id="dossier-comms" order={2} className={styles.headerPin} />
        <span className={styles.dot} />
        <span className="ink" style={{ fontSize: "11px", letterSpacing: "1px" }}>
          HOW TO REACH THE SUBJECT
        </span>
      </div>

      <div className={styles.grid}>
        {links.map((link) => (
          <SocialStub key={link.field} field={link.field} value={link.value} type={link.type} />
        ))}
      </div>
    </div>
  );
}

function SocialStub({ field, value, type }) {
  const label = fieldLabel(field);
  const info = META[field.toLowerCase()] || { icon: "email", meta: "CHANNEL_OPEN" };
  let href = value;
  if (type === "email") href = `mailto:${value}`;
  if (type === "phone") href = `tel:${value}`;

  return (
    <a
      href={href}
      target={type === "social_link" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`${styles.stub} paperShadow`}
    >
      <div className={styles.perforation} />
      <div className={styles.stubHeader}>
        <div className={styles.iconBox}>{ICONS[info.icon]}</div>
        <span className={`${styles.meta} ink`}>{info.meta}</span>
      </div>
      <div className={`${styles.label} ink`}>{label}</div>
      <div className={`${styles.value} ink`}>{value}</div>
      <div className={`${styles.action} ink`}>
        <span className={styles.actionLabel}>INITIATE_CONNECTION</span>
        <span className={styles.actionRedaction} aria-hidden="true">ENCRYPTED — HOVER TO DECODE</span>
      </div>
    </a>
  );
}

// Label Formatter
function fieldLabel(field) {
  switch (field.toLowerCase()) {
    case "email": return "ENCRYPTED_EMAIL";
    case "linkedin": return "LINKEDIN";
    case "whatsapp": return "SECURE_WHATSAPP";
    case "twitter": return "X_TWITTER";
    case "github": return "CODEBASE_STATION";
    case "phone": return "VOICE_COMMS";
    default: return field.charAt(0).toUpperCase() + field.slice(1);
  }
}
