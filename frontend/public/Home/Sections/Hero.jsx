import React from "react";
import styles from "../Home.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1>
        Hi, I'm <span className={styles.highlight}>Okumu Joseph(joseraven01)</span>  
        <br />
        <span className={styles.roleSwitch}>Software Developer</span>
        {/* Later: put a <PersonaSwitcher /> here for dynamic role */}
      </h1>
      <p className={styles.subtitle}>
        I build impactful <span>software</span>, <span>tools</span>,  
        and <span>solutions</span>—adaptable to every tech challenge.
      </p>
      {/* You can add a subtle background or a profile SVG here */}
    </section>
  );
}