import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import styles from "./PublicLayout.module.css";
import logo from "./logo.jpeg"; 

export default function PublicLayout() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.layoutWrapper}>
      {/* ==== NAVBAR ==== */}
      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          {/* Logo Section */}
          <div className={styles.logoGroup}>
            <img src={logo} alt="JR Logo" className={styles.logoImage} />
            <Link to="/" className={styles.logoText} onClick={closeMenu}>
              MyPortfolio
            </Link>
          </div>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <nav className={styles.desktopNav}>
            <Link className={styles.navLink} to="/projects">Projects</Link>
            <Link className={styles.navLink} to="/timeline">Timeline</Link>
            <Link className={styles.navLink} to="/contact">Contact</Link>
            <Link className={styles.adminLink} to="/admin">Admin</Link>
          </nav>

          {/* Mobile Menu Toggle (Visible only on Mobile) */}
          <button 
            className={styles.mobileToggle} 
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? "CLOSE [X]" : "MENU [=]"}
          </button>
        </div>
      </header>

      {/* ==== MOBILE OVERLAY MENU ==== */}
      <div className={`${styles.mobileMenuOverlay} ${isMenuOpen ? styles.open : ""}`}>
        <nav className={styles.mobileNavLinks}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/projects" onClick={closeMenu}>Projects</Link>
          <Link to="/timeline" onClick={closeMenu}>Timeline</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          <Link to="/admin" onClick={closeMenu} className={styles.mobileAdmin}>Admin Portal</Link>
        </nav>
      </div>

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