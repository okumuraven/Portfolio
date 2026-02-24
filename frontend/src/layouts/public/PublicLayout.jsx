import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import styles from "./PublicLayout.module.css";
import logo from "./logo.jpeg"; 

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/projects", label: "Projects" },
  { to: "/skill-matrix", label: "Skill Matrix" },
  { to: "/timeline", label: "Timeline" },
  { to: "/contact", label: "Contact" },
];
const ADMIN_LINK = { to: "/admin", label: "Admin", className: "adminLink" };
const ADMIN_LABEL_MOBILE = "Admin Portal";

export default function PublicLayout() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Prevent background scroll when menu open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // Close menu when clicking backdrop
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) setMenuOpen(false);
  }, []);

  // Helper: is nav item selected
  const isActive = (to, exact = false) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to) && to !== "/";
  };

  return (
    <div className={styles.layoutWrapper}>
      {/* ==== NAVBAR ==== */}
      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          {/* Logo Section */}
          <div className={styles.logoGroup}>
            <img src={logo} alt="JR Logo" className={styles.logoImage} />
            <Link to="/" className={styles.logoText}>MyPortfolio</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Main Navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                className={`${styles.navLink} ${isActive(link.to, link.exact) ? styles.active : ""}`}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={ADMIN_LINK.to}
              className={styles[ADMIN_LINK.className] || styles.navLink}
            >
              {ADMIN_LINK.label}
            </Link>
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
            {NAV_LINKS.map(link => (
              <Link
                key={link.to + "-mobile"}
                to={link.to}
                className={isActive(link.to, link.exact) ? styles.active : ""}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={ADMIN_LINK.to}
              className={styles.mobileAdmin}
              style={{ marginTop: 12 }}
            >
              {ADMIN_LABEL_MOBILE}
            </Link>
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
        {/* Optional: <a href="mailto:your@email.com" style={{marginLeft: 16}}>Contact</a> */}
      </footer>
    </div>
  );
}