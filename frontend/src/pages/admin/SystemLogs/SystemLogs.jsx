import React from "react";
import "../../../styles/dossier.css";
import styles from "./SystemLogs.module.css";

export default function SystemLogs() {
  return (
    <div className={styles.wrap}>
      <div className={styles.folder}>
        <span className={`${styles.tab} ink`}>CASE FILE // ACTIVITY</span>
        <span className={styles.sealStamp}>SEALED</span>

        <h1 className={`${styles.title} display`}>System Logs</h1>
        <p className={`${styles.body} bodyCopy`}>
          This drawer isn&rsquo;t wired to the record room yet &mdash; there&rsquo;s no
          audit trail being captured on the backend, so there&rsquo;s nothing to show here.
        </p>
        <p className={`${styles.note} ink`}>
          {"// login attempts, 2FA changes and admin writes are not yet logged to a persistent store"}
        </p>
      </div>
    </div>
  );
}
