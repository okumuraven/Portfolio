import React from "react";
import PersonaSwitcher from "../../../features/roles/PersonaSwitcher";
import TimelinePreview from "../../../components/timeline/TimelinePreview";
import HighlightSection from "../../../components/ui/HighlightSection";
import ContactCTA from "../../../components/feedback/ContactCTA";
import "./Home.css"; // You can create this for hero theming/styles if needed

/**
 * HomePage
 * Public-facing dynamic landing page for the Dynamic Portfolio System.
 * Displays a hero block, persona switcher, recent achievements timeline, 
 * and a call-to-action for contact.
 */
const HomePage = () => {
  return (
    <main className="home-root">
      {/* HERO SECTION */}
      <section className="home-hero">
        <h1 className="home-title">
          Unlocking My <span className="home-highlight">Next Persona Mode</span>
        </h1>
        <p className="home-subtitle">
          Welcome! Switch my professional profile on the fly—Developer. Cyber Analyst. Achiever.
        </p>
      </section>

      {/* PERSONA MODE SWITCHER */}
      <PersonaSwitcher />

      {/* FEATURE HIGHLIGHTS */}
      <HighlightSection
        highlights={[
          { icon: "💼", label: "Real Client Work", detail: "Production-ready projects in multiple domains." },
          { icon: "💡", label: "Certifications", detail: "All certifications instantly verifiable." },
          { icon: "🚀", label: "Dynamic Skills", detail: "Tech stack evolves with every sprint." },
        ]}
      />

      {/* RECENT TIMELINE/ACHIEVEMENTS PREVIEW */}
      <section className="home-timeline">
        <h2>Latest Achievements</h2>
        <TimelinePreview max={3} />
      </section>

      {/* CONTACT CALL-TO-ACTION */}
      <ContactCTA />
    </main>
  );
};

export default HomePage;