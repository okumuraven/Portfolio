// src/layouts/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Toggle function
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  
  // Close sidebar when a link is clicked (for mobile)
  const closeSidebar = () => setSidebarOpen(false);

  // Helper for active link styling
  const getLinkClass = ({ isActive }) => 
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <div className={styles.layoutWrapper}>
      
      {/* ==== MOBILE OVERLAY ==== */}
      {/* Dims the background when menu is open on mobile */}
      <div 
        className={`${styles.overlay} ${isSidebarOpen ? styles.overlayOpen : ''}`} 
        onClick={closeSidebar}
      />

      {/* ==== SIDEBAR (COMMAND DRAWER) ==== */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        
        {/* Title Area */}
        <div className={styles.adminTitle}>
          <span className={styles.statusDot}></span>
          Admin_Console
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navGroup}>
          <NavLink to="/admin" end className={getLinkClass} onClick={closeSidebar}>
            / Dashboard
          </NavLink>
          <NavLink to="/admin/roles" className={getLinkClass} onClick={closeSidebar}>
            / Roles & Personas
          </NavLink>
          <NavLink to="/admin/skills" className={getLinkClass} onClick={closeSidebar}>
            / Skill_Matrix
          </NavLink>
          <NavLink to="/admin/achievements" className={getLinkClass} onClick={closeSidebar}>
            / Timeline_Feed
          </NavLink>
          <NavLink to="/admin/activity" className={getLinkClass} onClick={closeSidebar}>
            / System_Logs
          </NavLink>
        </nav>

        {/* Bottom Area: Exit */}
        <div className={styles.backLinkWrapper}>
          <Link to="/" className={styles.backLink}>
            ← Eject to Public Site
          </Link>
        </div>
      </aside>

      {/* ==== MAIN INTERFACE ==== */}
      <div className={styles.mainWrapper}>
        
        {/* Top Header */}
        <header className={styles.topHeader}>
          {/* Mobile Toggle Button (Visible only on phone) */}
          <button className={styles.mobileToggle} onClick={toggleSidebar}>
            [::]
          </button>

          <span className={styles.headerTitle}>System Configuration</span>
          
          {/* Pushes User Badge to the right */}
          <div style={{ marginLeft: "auto" }} className={styles.userBadge}>
            USER: <strong>SUPER_ADMIN</strong>
          </div>
        </header>

        {/* Content Render Area */}
        <main className={styles.contentArea}>
          <Outlet />
        </main>

        {/* Minimal Footer */}
        <footer className={styles.footer}>
          SECURE CONNECTION // ENCRYPTED
        </footer>
      </div>
    </div>
  );
}