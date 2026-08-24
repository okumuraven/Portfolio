import React from "react";
import styles from "./OperationsLog.module.css";
import { CasePin } from "../../../../components/caseboard/CaseBoard";

const STACK_MODULES = [
  { name: "React.js", caption: "frontend_core", icon: "react/react-original" },
  { name: "Node.js", caption: "fastify_runtime", icon: "nodejs/nodejs-original" },
  { name: "PostgreSQL", caption: "primary_store", icon: "postgresql/postgresql-original" },
  { name: "Docker", caption: "containerized", icon: "docker/docker-original" },
  { name: "Python", caption: "django_backend", icon: "python/python-original" },
  { name: "Linux", caption: "kali . parrot", icon: "linux/linux-original" },
];

export default function OperationsLog() {
  return (
    <section className={`${styles.section} deskBg`}>
      <div className={styles.inner}>
        {/* Operations log receipt */}
        <div className={`${styles.receipt} torn paperShadow`}>
          <CasePin id="opslog" order={20} className={styles.pin} />
          <div className={styles.washi} />
          <div className={`${styles.receiptTitle} ink`}>OPERATIONS_LOG</div>
          <div className={`${styles.receiptSub} ink`}>role · duration · unit</div>
          <div className={styles.divider} />

          <div className={`${styles.row} ink`}>
            <span>SOFTWARE ENGINEER</span><span>2024–2026</span>
          </div>
          <div className={`${styles.row} ink`}>
            <span>WEB DEVELOPER</span><span>2024–2026</span>
          </div>
          <div className={styles.circledRowWrap}>
            <span className={styles.circleMark} />
            <div className={`${styles.row} ink`}>
              <span>CYBER SECURITY</span><span>2025–2026</span>
            </div>
          </div>
          <div className={`${styles.row} ink`}>
            <span>APP DEVELOPER</span><span>2025–2026</span>
          </div>

          <div className={styles.divider} />
          <div className={styles.barcode} />
          <div className={`${styles.caseId} ink`}>CASE_ID // OKR-2026-004</div>
        </div>

        {/* Stack modules */}
        <div className={styles.stackGrid}>
          {STACK_MODULES.map((mod) => (
            <div key={mod.name} className={`${styles.chip} paperShadow`}>
              <div className={styles.chipPins}>
                <span /><span /><span />
              </div>
              <img
                className={styles.chipIcon}
                src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${mod.icon}.svg`}
                alt=""
                loading="lazy"
              />
              <div className={`${styles.chipName} ink`}>{mod.name.toUpperCase()}</div>
              <div className={`${styles.chipCaption} bodyCopy`}>{mod.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
