// src/pages/public/Contact/SocialLinks.jsx
import React from "react";
import styles from "./SocialLinks.module.css";

// Receives: [{ field, value, type }, ...]
export default function SocialLinks({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.sectionLabel}>{"// TRANSMISSION_CHANNELS"}</div>
      
      <div className={styles.socialLinksRow}>
        {links.map(link => (
          <SocialLinkBtn 
            key={link.field} 
            field={link.field} 
            value={link.value} 
            type={link.type} 
          />
        ))}
      </div>
    </div>
  );
}

// Button Component
function SocialLinkBtn({ field, value, type }) {
  let label = fieldLabel(field);
  let href = value;
  
  if (type === "email") href = `mailto:${value}`;
  if (type === "phone") href = `tel:${value}`;
  
  return (
    <a
      href={href}
      className={styles.socialButton}
      rel="noopener noreferrer"
      target={type === "social_link" ? "_blank" : undefined}
      tabIndex={0}
      title={label}
      data-network={field.toLowerCase()} // Hook for brand colors in CSS
    >
      <span className={styles.socialLabel}>{label}</span>
    </a>
  );
}

// Label Formatter
function fieldLabel(field) {
  switch (field.toLowerCase()) {
    case "email": return "INITIATE_EMAIL";
    case "linkedin": return "LINKEDIN";
    case "whatsapp": return "SECURE_WHATSAPP";
    case "twitter": return "X_TWITTER";
    case "github": return "GITHUB_REPOS";
    case "phone": return "VOICE_COMMS";
    default: return field.charAt(0).toUpperCase() + field.slice(1);
  }
}