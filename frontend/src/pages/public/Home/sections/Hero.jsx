// sections/Hero.jsx
import React from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* 1. Technical Intro */}
      <div className={styles.introTag}>
        {/* SYSTEM_ONLINE */}
      </div>

      {/* 2. High Impact Title */}
      <h1>
        Okumu <br />
        <span className={styles.highlight}>Joseph</span>
      </h1>

      {/* 3. Description Block */}
      <div className={styles.roleContainer}>
        <span className={styles.roleSwitch}>
          Full Stack Developer | Cyber Analyst
        </span>
        <p className={styles.subtitle}>
          Building resilient digital architecture and securing the modern web.
        </p>
      </div>

      {/* 4. Visual Flourish */}
      <div className={styles.decorLine}>
        SCROLL_TO_INITIALIZE <span style={{fontWeight: "bold"}}>&rarr;</span>
      </div>
    </section>
  );
}