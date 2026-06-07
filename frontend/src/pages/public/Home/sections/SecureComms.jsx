import React from "react";
import styles from "./SecureComms.module.css";

function CommCard({ icon, label, value, link, color, meta }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className={styles.card} style={{ "--accent": color }}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <i className={icon}></i>
        </div>
        <div className={styles.metaBadge}>{meta}</div>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.label}>{label} {" //"}</span>
        <span className={styles.value}>{value}</span>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.action}>[ INITIATE_CONNECTION ]</span>
        <div className={styles.glow} />
      </div>
    </a>
  );
}

export default function SecureComms() {
  // Static/Fallback channels (Verified Professional Comms)
  const defaultComms = [
    {
      id: "email",
      icon: "fas fa-envelope",
      label: "ENCRYPTED_EMAIL",
      value: "okumuraven@gmail.com",
      link: "mailto:okumuraven@gmail.com",
      color: "#ff5500", // Orange
      meta: "AES-256_SECURE"
    },
    {
      id: "whatsapp",
      icon: "fab fa-whatsapp",
      label: "DIRECT_WHATSAPP",
      value: "+254 794 534 817",
      link: "https://wa.me/254794534817",
      color: "#00ff88", // Cyber Green
      meta: "END-TO-END_UPLINK"
    },
    {
      id: "github",
      icon: "fab fa-github",
      label: "CODEBASE_STATION",
      value: "github.com/okumuraven",
      link: "https://github.com/okumuraven",
      color: "#ffffff", // White/Silver
      meta: "REPOSITORY_NODE_OPEN"
    },
    {
      id: "voice",
      icon: "fas fa-phone-alt",
      label: "SECURE_VOICE",
      value: "OKUMU RAVEN [HQ]",
      link: "tel:+254794534817",
      color: "#00e5ff", // Cyan
      meta: "LOCAL_RELAY_ENABLE"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <div className={styles.statusLine}>
             <span className={styles.dot}></span>
             SYSTEM_READY // COMMS_HUB_ONLINE
          </div>
          <h2 className={styles.title}>SECURE_COMMUNICATIONS</h2>
          <p className={styles.subtitle}>
            Direct channels for professional consultation, architectural scoping, and operational deployment.
          </p>
        </div>

        <div className={styles.grid}>
          {defaultComms.map(comm => (
            <CommCard key={comm.id} {...comm} />
          ))}
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.log}>[LOG] UPLINK_STANDBY... WAITING_FOR_DIRECTIVE</span>
        </div>
      </div>
    </section>
  );
}
