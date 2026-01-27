import React from "react";
import styles from "../Home.module.css";

/**
 * ContactCTA Section
 * - Final "call to action": prompts client/user to reach out.
 * - Customize email/WhatsApp to your real contact info.
 */
export default function ContactCTA() {
  return (
    <section className={styles.cta}>
      <h3>Ready to work together?</h3>
      <a
        href="mailto:okumuraven@gmail.com"
        className={styles.contactButton}
      >
        Email Me
      </a>
      <a
        href="https://wa.me/+254794534817"
        className={styles.contactButton}
      >
        WhatsApp
      </a>
    </section>
  );
}