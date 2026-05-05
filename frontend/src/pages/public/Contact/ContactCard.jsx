import React from "react";
import styles from "./ContactCard.module.css";

/**
 * Professional, dynamic contact/about card.
 * Displays all relevant fields passed from profile API/admin.
 */
export default function ContactCard(props) {
  // Recommended keys for specially styled sections
  const {
    real_name,
    avatar_url,
    status,
    base,
    location,
    primary_mode,
    secondary_mode,
    about_summary,
    core_directive,
    philosophy,
    human_layer,
    work_philosophy,
    ...otherFields // Collect all other fields (future extensibility)
  } = props;

  return (
    <div className={styles.contactCard}>
      {/* AVATAR / PROFILE IMAGE */}
      {avatar_url && (
        <div className={styles.avatarWrapper}>
          <img
            className={styles.avatar}
            src={avatar_url}
            alt={real_name || "Operative Profile"}
            loading="lazy"
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>
      )}

      <div className={styles.infoSection}>
        {/* STATUS */}
        {status && (
          <div className={styles.sysStatus}>
            <span className={styles.blink}></span>
            OPERATIVE_STATUS: {status}
          </div>
        )}
        {/* NAME */}
        <h2 className={styles.realName}>
          {real_name || "UNKNOWN_OPERATIVE"}
        </h2>

        {/* KEY METADATA ROWS */}
        <div className={styles.metadata}>
          {base && (
            <div className={styles.metaItem}>
              <span className={styles.label}>BASE {" // "}</span> {base}
            </div>
          )}
          {location && (
            <div className={styles.metaItem}>
              <span className={styles.label}>LOC {" // "}</span> {location}
            </div>
          )}
          {primary_mode && (
            <div className={styles.metaItem}>
              <span className={styles.label}>PRIMARY_MODE {" // "}</span> {primary_mode}
            </div>
          )}
          {secondary_mode && (
            <div className={styles.metaItem}>
              <span className={styles.label}>SECONDARY_MODE {" // "}</span> {secondary_mode}
            </div>
          )}
          {core_directive && (
            <div className={styles.metaItem}>
              <span className={styles.label}>DIRECTIVE {" // "}</span>
              <span className={styles.coreDirective}>{core_directive}</span>
            </div>
          )}
        </div>

        {/* MISSION SUMMARY */}
        {about_summary && (
          <p className={styles.summary}>{about_summary}</p>
        )}

        {/* HUMAN_LAYER (Soft bio, interests, etc) */}
        {human_layer && (
          <div className={styles.humanLayer}>
            <span className={styles.humanLayerLabel}>HUMAN_LAYER:</span>
            {human_layer}
          </div>
        )}

        {/* PHILOSOPHY */}
        {philosophy && (
          <div className={styles.philosophy}>
            <span className={styles.philosophyLabel}>OPERATIONAL_PHILOSOPHY:</span>
            {philosophy}
          </div>
        )}

        {/* WORK PHILOSOPHY */}
        {work_philosophy && (
          <div className={styles.workPhilosophy}>
            <span className={styles.workPhilosophyLabel}>WORK_PHILOSOPHY:</span>
            {work_philosophy}
          </div>
        )}

        {/* Render any future fields dynamically (optional) */}
        {Object.keys(otherFields).map(key =>
          otherFields[key] ? (
            <div key={key} className={styles.metaItem}>
              <span className={styles.label}>{key.replace(/_/g, ' ').toUpperCase()} {"//"}</span> {otherFields[key]}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
