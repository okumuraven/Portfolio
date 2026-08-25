import React, { useState, useEffect, useMemo } from "react";
import styles from "./Hero.module.css";
import headshot from "../../../../assets/okumu-headshot.jpg";
import { CasePin } from "../../../../components/caseboard/CaseBoard";
import { usePersonas } from "../../../../features/personas/usePersonas";
import { useSkills } from "../../../../features/skills/useSkills";
import { groupSkillsByCategory } from "../../../../features/skills/skillUtils";

/**
 * Case printout — a dot-matrix style readout that fetches real skill data,
 * dressed as a torn receipt instead of a terminal window.
 */
function CasePrintout() {
  const { data: rawSkills = [], isLoading } = useSkills();
  const [visibleLines, setVisibleLines] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const printoutData = useMemo(() => {
    if (!rawSkills.length) return [];
    const grouped = groupSkillsByCategory(rawSkills);

    const mapping = [
      { search: "front", label: "FRONTEND" },
      { search: "back", label: "BACKEND" },
      { search: "data", label: "DATABASE" },
      { search: "sec", label: "SECURITY" },
      { search: "dev", label: "DEVOPS" },
    ];

    return mapping.map((m) => {
      const categoryKey = Object.keys(grouped).find((k) =>
        k.toLowerCase().includes(m.search.toLowerCase())
      );
      const list = categoryKey
        ? grouped[categoryKey].slice(0, 4).map((s) => s.name).join(", ")
        : "pending verification...";
      return { label: m.label, value: list };
    });
  }, [rawSkills]);

  useEffect(() => {
    if (isLoading) return;
    const totalLines = printoutData.length + 3;
    if (visibleLines < totalLines) {
      const timer = setTimeout(
        () => setVisibleLines((prev) => prev + 1),
        visibleLines === 0 ? 500 : visibleLines === 1 ? 900 : 380
      );
      return () => clearTimeout(timer);
    } else {
      setIsDone(true);
    }
  }, [visibleLines, isLoading, printoutData.length]);

  return (
    <div className={`${styles.printout} torn paperShadow`}>
      <div className={`${styles.printoutHead} ink`}>CASE_PRINTOUT // SKILL_SCAN.LOG</div>
      <div className={styles.perforation} />

      {visibleLines >= 1 && (
        <div className={`${styles.line} ink`}>
          <span className={styles.prompt}>&gt;</span> ./analyze --target=okumuraven
        </div>
      )}

      {visibleLines >= 2 && (
        <div className={`${styles.line} ink`} style={{ color: "#6b5b3f" }}>
          {visibleLines === 2 ? (
            <span className={styles.blinking}>[SCANNING_SYSTEM_RESOURCES...]</span>
          ) : (
            <span style={{ color: "var(--dossier-accent)" }}>[SCAN_COMPLETE] // 100% VERIFIED</span>
          )}
        </div>
      )}

      <div className={styles.output}>
        {printoutData.map(
          (item, idx) =>
            visibleLines >= idx + 3 && (
              <div key={idx} className={`${styles.outputLine} ink`}>
                <span className={styles.tag}>[{item.label}]</span> {item.value}
              </div>
            )
        )}
      </div>

      {isDone && (
        <div className={`${styles.line} ink`}>
          <a href="/skill-matrix" className={styles.printoutLink}>
            cd ./SKILL_MATRIX <span className={styles.cursor}>_</span>
          </a>
        </div>
      )}

      {!isDone && visibleLines === 0 && (
        <div className={`${styles.line} ink`}>
          <span className={styles.cursor}>_</span>
        </div>
      )}

      <div className={styles.barcode} />
    </div>
  );
}

export default function Hero() {
  const { personas, activePersonaId, setActivePersonaId } = usePersonas();

  // Static Core Identity (Guarantees Instant Load & Perfect UX)
  const coreProfile = {
    name: "OKUMU JOSEPH",
    handle: "OKUMU RAVEN",
    title: "FULL-STACK ARCHITECT & SECURITY RESEARCHER",
    description:
      "Specializing in cutting-edge frontend interfaces, highly concurrent backend systems, and offensive security. I engineer solutions that scale and withstand modern cyber threats.",
  };

  const activePersona = personas?.find((p) => String(p.id) === String(activePersonaId)) || null;

  const displayData = {
    title: activePersona?.title || coreProfile.title,
    description: activePersona?.description || coreProfile.description,
    type: activePersona?.type || "LEAD ARCHITECT",
  };

  return (
    <section className={`${styles.hero} deskBg`}>
      <div className={styles.heroInner}>
        {/* Polaroid */}
        <div className={`${styles.polaroid} paperShadow`}>
          <CasePin id="hero" order={0} className={styles.pin} />
          <div className={styles.photoFrame}>
            <img src={headshot} alt="Okumu Joseph" className={styles.photo} />
          </div>
          <div className={`${styles.polaroidCaption} ink`}>OKUMU JOSEPH</div>
        </div>

        {/* Quote sticky */}
        <div className={`${styles.sticky} paperShadow`}>
          <CasePin id="hero-quote" order={1} className={styles.stickyPin} />
          <div className="hand">&ldquo;Secure by design. I build systems that scale — and survive contact with real threats.&rdquo;</div>
        </div>

        {/* Title kraft card */}
        <div className={`${styles.titleCard} torn paperShadow`}>
          <CasePin id="hero-title" order={2} className={styles.titlePin} />
          <div className={`${styles.fileLabel} ink`}>
            OPERATIONAL_FILE // NO. 0X29-JR &nbsp;·&nbsp;{" "}
            <span className={styles.statusText}>STATUS: {displayData.type.toUpperCase()}</span>
          </div>

          <h1 className={`${styles.mainTitle} display`}>
            {coreProfile.name.split(" ").map((word) => (
              <React.Fragment key={word}>
                {word}
                <br />
              </React.Fragment>
            ))}
          </h1>
          <div className={`${styles.handle} ink`}>( {coreProfile.handle} )</div>

          <div className={styles.highlightWrap}>
            <span className={`${styles.highlight} ink`}>{displayData.title.toUpperCase()}</span>
          </div>

          <p className={`${styles.description} bodyCopy`}>{displayData.description}</p>

          <div className={styles.actionRow}>
            <a href="/projects" className={`${styles.primaryBtn} ink`}>[ VIEW_OPERATIONS ]</a>
            <a href="/contact" className={`${styles.secondaryBtn} ink`}>INITIATE_CONTACT</a>
          </div>

          {personas && personas.length > 1 && (
            <div className={styles.overrideModule}>
              <span className={`${styles.overrideLabel} ink`}>CLEARANCE_OVERRIDE:</span>
              <select
                value={activePersonaId || activePersona?.id || ""}
                onChange={(e) => setActivePersonaId(e.target.value)}
                className={`${styles.overrideSelect} ink`}
              >
                <option value="" disabled>SELECT_PROFILE</option>
                {personas.map((role) => (
                  <option key={role.id} value={role.id}>{role.title.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}

          <div className={`${styles.verifiedStamp} stamp`}>VERIFIED<br />{"// OPERATIONAL"}</div>
        </div>

        {/* Location tag */}
        <div className={`${styles.locationTag} paperShadow ink`}>
          <CasePin id="hero-location" order={3} className={styles.locationPin} />
          LOC // KENYA — <span className={styles.circled}>GLOBAL OPS CAPACITY</span>
        </div>

        {/* Case printout */}
        <div className={styles.printoutCol}>
          <CasePin id="hero-printout" order={4} className={styles.printoutPin} />
          <CasePrintout />
        </div>
      </div>
    </section>
  );
}
