import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import styles from "./PublicLayout.module.css";
import logo from "./logo.jpeg"; 

export default function PublicLayout() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  
  // Optional: Prevent background scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // Close menu when clicking/tapping background overlay
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) setMenuOpen(false);
  }, []);

  return (
    <div className={styles.layoutWrapper}>
      {/* ==== NAVBAR ==== */}
      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          {/* Logo Section */}
          <div className={styles.logoGroup}>
            <img src={logo} alt="JR Logo" className={styles.logoImage} />
            <Link to="/" className={styles.logoText}>
              MyPortfolio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Main Navigation">
            <Link className={styles.navLink} to="/projects">Projects</Link>
            <Link className={styles.navLink} to="/skill-matrix">Skill Matrix</Link>
            <Link className={styles.navLink} to="/timeline">Timeline</Link>
            <Link className={styles.navLink} to="/contact">Contact</Link>
            <Link className={styles.adminLink} to="/admin">Admin</Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className={styles.mobileToggle} 
            onClick={() => setMenuOpen(open => !open)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            aria-pressed={isMenuOpen}
          >
            {isMenuOpen ? "CLOSE [X]" : "MENU [=]"}
          </button>
        </div>
      </header>

      {/* ==== MOBILE OVERLAY MENU ==== */}
      {isMenuOpen && (
        <div
          className={styles.mobileMenuOverlay + " " + (isMenuOpen ? styles.open : "")}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
        >
          <nav className={styles.mobileNavLinks} aria-label="Mobile Navigation">
            <Link to="/" >Home</Link>
            <Link to="/projects" >Projects</Link>
            <Link to="/skill-matrix" >Skill Matrix</Link>
            <Link to="/timeline" >Timeline</Link>
            <Link to="/contact" >Contact</Link>
            <Link to="/admin" className={styles.mobileAdmin}>Admin Portal</Link>
          </nav>
        </div>
      )}

      {/* ==== PAGE CONTENT ==== */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {/* ==== FOOTER ==== */}
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} JoseRaven01.
      </footer>
    </div>
  );
}