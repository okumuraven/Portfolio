import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getContactProfile } from "../../../api/contact.api";
import "../../../styles/dossier.css";
import { CaseBoardProvider, CasePin } from "../../../components/caseboard/CaseBoard";
import ContactCard from "./ContactCard";
import SocialLinks from "./SocialLinks";
import Seo from "../../../components/seo/Seo";
import styles from "./Contact.module.css";

const CONTACT_SEO = {
  title: "Contact — Okumu Joseph (Okumu Raven) | Full-Stack Engineer & Security Researcher, Kenya",
  description: "Get in touch with Okumu Joseph (Okumu Raven / Musundi), a full-stack engineer, backend engineer, and security researcher based in Kenya.",
  path: "/contact",
};

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
      <section className={`${styles.contactRoot} deskBg`}>
        <Seo {...CONTACT_SEO} />
        <div className={`${styles.loader} ink`}>PULLING SUBJECT DOSSIER...</div>
      </section>
    );

  if (error)
    return (
      <section className={`${styles.contactRoot} deskBg`}>
        <Seo {...CONTACT_SEO} />
        <div className={`${styles.loader} ink`}>SYSTEM ERROR: COMMS LINK FAILED.</div>
      </section>
    );

  if (!Array.isArray(data) || data.length === 0)
    return (
      <section className={`${styles.contactRoot} deskBg`}>
        <Seo {...CONTACT_SEO} />
        <div className={`${styles.loader} ink`}>NO DOSSIER ON FILE.</div>
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
    if (["social_link", "email", "phone"].includes(item.type)) {
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
    <section className={`${styles.contactRoot} deskBg`}>
      <Seo {...CONTACT_SEO} />
      <CaseBoardProvider>
        <div className={styles.container}>
          {/* PAGE HEADER */}
          <div className={`${styles.header} torn paperShadow`}>
            <CasePin id="dossier-header" order={0} className={styles.headerPin} />
            <div className={`${styles.headerKicker} ink`}>PERSONNEL FILE</div>
            <h1 className={`${styles.title} display`}>SUBJECT DOSSIER</h1>
            <p className={`${styles.subtitle} bodyCopy`}>Everything on file about the man behind the case.</p>
          </div>

          {/* CONTENT LAYOUT */}
          <div className={styles.contentWrapper}>
            {/* The Dossier Card with all about/profile fields */}
            <ContactCard {...cardFields} />
            {/* The Social / Link Buttons (contact networks) */}
            <SocialLinks links={socialFields} />
          </div>
        </div>
      </CaseBoardProvider>
    </section>
  );
}
