// src/layouts/public/PublicLayout.jsx
import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import styles from "./PublicLayout.module.css";
// Ensure this path matches where your image actually is
import logo from "./logo.jpeg"; 

export default function PublicLayout() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Toggle function
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  // Close menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.layoutWrapper}>
      {/* ==== NAVBAR ==== */}
      <header className={styles.navbar}>
        
        {/* Logo Section */}
        <div className={styles.logoGroup}>
          {/* If the logo has a white background, mix-blend-mode helps it blend into dark mode */}
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
          <Link className={styles.adminLink} to="/admin">{/* ADM */}</Link>
        </nav>

        {/* Mobile Menu Toggle (Visible only on Mobile) */}
        <button 
          className={styles.mobileToggle} 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? "CLOSE [X]" : "MENU [=]"}
        </button>
      </header>

      {/* ==== MOBILE OVERLAY MENU ==== */}
      {/* Only renders when isMenuOpen is true */}
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