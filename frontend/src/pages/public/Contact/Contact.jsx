import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getContactProfile } from "../../../api/contact.api";
import ContactCard from "./ContactCard";
import SocialLinks from "./SocialLinks";
import styles from "./Contact.module.css";

/**
 * Well-architected public contact/profile page.
 * Dynamically supports all main profile fields and social/contact links.
 */
export default function Contact() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["contact-profile"],
    queryFn: getContactProfile,
    staleTime: 1000 * 60 * 10,
  });

  // --- SYSTEM LOADING & ERROR STATES ---
  if (isLoading)
    return (
      <section className={styles.contactRoot}>
        <div className={styles.loader}>[ ESTABLISHING_SECURE_CONNECTION... ]</div>
      </section>
    );

  if (error)
    return (
      <section className={styles.contactRoot}>
        <div className={styles.error}>[ SYSTEM_ERROR: COMMS_LINK_FAILED ]</div>
      </section>
    );

  if (!Array.isArray(data) || data.length === 0)
    return (
      <section className={styles.contactRoot}>
        <div className={styles.empty}>[ NO_CONTACT_DATA_FOUND ]</div>
      </section>
    );

  /**
   * Separate main profile fields from social/contact links.
   * - mainFields: all "string", "text", "markdown", or image fields (for ContactCard)
   * - socialFields: all "email", "phone", or "social_link" types (for SocialLinks)
   */
  const mainFields = {};
  const socialFields = [];
  let avatarFieldKey = null;

  data.forEach((item) => {
    if (
      ["social_link", "email", "phone"].includes(item.type)
    ) {
      socialFields.push(item);
    } else {
      // Everything else goes to mainFields (extensible, not hard-coded)
      mainFields[item.field] = item.value;
      if (item.type === "image" && !avatarFieldKey) avatarFieldKey = item.field;
    }
  });

  // Try to use avatar_url if present, else any image field
  const cardFields = { ...mainFields };
  if (!cardFields.avatar_url && avatarFieldKey) {
    cardFields.avatar_url = mainFields[avatarFieldKey];
  }

  return (
    <section className={styles.contactRoot}>
      {/* PAGE HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          SECURE <span>COMMS</span>
        </h1>
        <p className={styles.subtitle}>{"// ESTABLISH_CONTACT_PROTOCOL"}</p>
      </div>

      {/* CONTENT LAYOUT */}
      <div className={styles.contentWrapper}>
        {/* The Dossier Card with all about/profile fields */}
        <ContactCard {...cardFields} />
        {/* The Social / Link Buttons (contact networks) */}
        <SocialLinks links={socialFields} />
      </div>
    </section>
  );
}