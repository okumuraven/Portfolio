import React from "react";
import { CasePin } from "../../../components/caseboard/CaseBoard";
import styles from "./ContactCard.module.css";

/**
 * Professional, dynamic contact/about card — styled as the front page of
 * an actual personnel file: photo, vitals form, and attached memos.
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
    <div className={`${styles.card} torn paperShadow`}>
      <CasePin id="dossier-card" order={1} className={styles.cardPin} />

      <div className={styles.topRow}>
        {/* SUBJECT PHOTO */}
        {avatar_url && (
          <div className={styles.photoFrame}>
            <img
              className={styles.avatar}
              src={avatar_url}
              alt={real_name || "Subject Photo"}
              loading="lazy"
              onError={(e) => (e.target.style.display = "none")}
            />
            <div className={`${styles.photoCaption} ink`}>SUBJECT PHOTO</div>
          </div>
        )}

        <div className={styles.identityBlock}>
          {status && (
            <div className={`${styles.statusStamp} ink`}>
              <span className={styles.statusDot} />
              STATUS: {status.toUpperCase()}
            </div>
          )}
          <div className={`${styles.subjectLabel} ink`}>SUBJECT //</div>
          <h2 className={`${styles.realName} display`}>{real_name || "UNKNOWN OPERATIVE"}</h2>
        </div>
      </div>

      {/* VITALS FORM */}
      <div className={styles.vitalsForm}>
        {base && <FormRow label="BASE" value={base} />}
        {location && <FormRow label="LOC" value={location} />}
        {primary_mode && <FormRow label="PRIMARY MODE" value={primary_mode} />}
        {secondary_mode && <FormRow label="SECONDARY MODE" value={secondary_mode} />}
        {core_directive && <FormRow label="DIRECTIVE" value={core_directive} accent />}
        {Object.keys(otherFields).map((key) =>
          otherFields[key] ? <FormRow key={key} label={key.replace(/_/g, " ")} value={otherFields[key]} /> : null
        )}
      </div>

      {/* ATTACHED MEMOS */}
      <div className={styles.memoStack}>
        {about_summary && <Memo label="MISSION SUMMARY" text={about_summary} />}
        {human_layer && <Memo label="HUMAN LAYER" text={human_layer} />}
        {philosophy && <Memo label="OPERATIONAL PHILOSOPHY" text={philosophy} />}
        {work_philosophy && <Memo label="WORK PHILOSOPHY" text={work_philosophy} />}
      </div>
    </div>
  );
}

function FormRow({ label, value, accent = false }) {
  return (
    <div className={styles.formRow}>
      <span className={`${styles.formLabel} ink`}>{label.toUpperCase()}</span>
      <span className={styles.formLeader} />
      <span className={`${styles.formValue} ${accent ? styles.formValueAccent : ""} bodyCopy`}>{value}</span>
    </div>
  );
}

function Memo({ label, text }) {
  return (
    <div className={`${styles.memo} paperShadow`}>
      <svg viewBox="0 0 24 44" className={styles.memoClip} aria-hidden="true">
        <path
          d="M8 6 Q8 2 12 2 Q18 2 18 8 L18 30 Q18 36 12 36 Q8 36 8 32 L8 14 Q8 11 11 11 Q14 11 14 14 L14 27"
          fill="none"
          stroke="#9a9a9a"
          strokeWidth="2.4"
        />
      </svg>
      <div className={`${styles.memoLabel} ink`}>{label}{" //"}</div>
      <p className={`${styles.memoText} bodyCopy`}>{text}</p>
    </div>
  );
}
