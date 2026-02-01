import React, { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import { useAuth } from "../../hooks/useAuth";

// Protects admin routes and displays user/contact info
export default function AdminLayout() {
  const { user, fetchUser, logout } = useAuth();
  const navigate = useNavigate();

  // On mount: ensure user is loaded and authenticated
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  // When user NOT authenticated, redirect to login
  useEffect(() => {
    if (user === null) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, navigate]);

  // Sidebar toggle logic
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);

  const getLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.layoutWrapper}>
      {/* ==== MOBILE OVERLAY ==== */}
      <div
        className={`${styles.overlay} ${isSidebarOpen ? styles.overlayOpen : ""}`}
        onClick={closeSidebar}
      />

      {/* ==== SIDEBAR ==== */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        {/* Title */}
        <div className={styles.adminTitle}>
          <span className={styles.statusDot}></span>
          Admin_Console
        </div>
        {/* Menu */}
        <nav className={styles.navGroup}>
          <NavLink to="/admin" end className={getLinkClass} onClick={closeSidebar}>
            / Dashboard
          </NavLink>
          <NavLink to="/admin/personas" className={getLinkClass} onClick={closeSidebar}>
            / Personas
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
        {/* Bottom: Exit */}
        <div className={styles.backLinkWrapper}>
          <Link to="/" className={styles.backLink}>
            ← Eject to Public Site
          </Link>
        </div>
      </aside>

      {/* ==== MAIN ==== */}
      <div className={styles.mainWrapper}>
        <header className={styles.topHeader}>
          <button className={styles.mobileToggle} onClick={toggleSidebar}>
            [::]
          </button>
          <span className={styles.headerTitle}>System Configuration</span>
          <div style={{ marginLeft: "auto" }} className={styles.userBadge}>
            USER: <strong>{user?.role?.toUpperCase() || "ADMIN"}</strong>
            {" / "}
            <span>{user?.email}</span>
            <button 
              className={styles.logoutBtn}
              onClick={() => { logout(); navigate("/auth/login"); }}
              title="Logout"
              style={{ marginLeft: 12 }}
            >Logout</button>
          </div>
        </header>
        <main className={styles.contentArea}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          SECURE CONNECTION // ENCRYPTED
        </footer>
      </div>
    </div>
  );
}