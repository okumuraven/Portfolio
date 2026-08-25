import React from "react";
import "../../../styles/dossier.css";
import styles from "./Home.module.css";
import Seo from "../../../components/seo/Seo";
import { CaseBoardProvider } from "../../../components/caseboard/CaseBoard";
// Import your section components (create them if you haven't yet)
import Hero from "./sections/Hero";
import PersonaOperations from "./sections/PersonaOperations";
import OperationsLog from "./sections/OperationsLog";
import SecurityCaseFile from "./sections/SecurityCaseFile";
import TimelinePreview from "./sections/TimelinePreview";
import SecureComms from "./sections/SecureComms";

// Defined outside the component so it's the same array reference on every
// render — CaseBoardProvider's recompute() depends on it, and a fresh
// literal here would re-trigger that on every Home render.
const CASE_CROSS_TIES = [
  ["hero", "persona-03"],
  ["persona-01", "secboard-in"],
  ["opslog", "timeline"],
  ["secboard-out", "comms"],
];

/**
 * Home (Landing) Page
 * - This is the first page users/clients see.
 * - Composed of modular sections for easy maintainability.
 * - Every pinned element across every section is threaded onto one
 *   continuous, live-measured red string (CaseBoardProvider), so the
 *   page reads as one detective's board of connected clues rather
 *   than separate blocks.
 */
export default function Home() {
  return (
    <>
      <Seo
        title="Okumu Joseph (Okumu Raven) | Full-Stack Engineer & Security Researcher in Kenya"
        description="Okumu Joseph — also known as Okumu Raven, Okumu Musundi, or Joseph Musundi — is a Full-Stack Engineer, Backend Engineer, and Security Researcher based in Kenya, building secure, high-performance web and app systems."
        path="/"
      />
      <main className={styles.root}>
        <CaseBoardProvider crossTies={CASE_CROSS_TIES}>
        {/* ==== HERO SECTION ==== */}
        <Hero />

        {/* ==== FOUR OPERATIONAL UNITS (Persona Cards) ==== */}
        <PersonaOperations />

        {/* ==== OPERATIONS LOG + STACK MODULES ==== */}
        <OperationsLog />

        {/* ==== SECURITY RESEARCHER CASE FILE (Evidence Board) ==== */}
        <SecurityCaseFile />

        {/* ==== RECENT ACHIEVEMENTS/TIMELINE ==== */}
        <TimelinePreview />

        {/* ==== SECURE COMMUNICATIONS HUB ==== */}
        <SecureComms />
        </CaseBoardProvider>
      </main>
    </>
  );
}
