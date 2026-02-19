import React, { useEffect, useState, useCallback } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout() {
  const { user, fetchUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Fetch user info on mount
  useEffect(() => {
    if (user === undefined) fetchUser();
  }, [user, fetchUser]);

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (user === null) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, navigate]);

  const toggleSidebar = useCallback(
    () => setSidebarOpen(open => !open), []
  );
  const closeSidebar = useCallback(
    () => setSidebarOpen(false), []
  );

  // Esc handler
  useEffect(() => {
    if (!isSidebarOpen) return;
    const escHandler = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [isSidebarOpen]);

  const getLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  // Show loading if user still loading
  if (user === undefined) return <div>Loading...</div>;

  return (
    <div className={styles.layoutWrapper}>
      {/* Overlay for mobile sidebar */}
      <div
        className={`${styles.overlay} ${isSidebarOpen ? styles.overlayOpen : ""}`}
        onClick={closeSidebar}
        aria-label="Close sidebar"
        role="button"
        tabIndex={0}
        onKeyPress={e => { if (e.key === "Enter") closeSidebar(); }}
      />
      {/* Sidebar navigation */}
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
        aria-label="Admin Navigation"
      >
        <div className={styles.adminTitle}>
          <span className={styles.statusDot} aria-label="Status: Online"></span>
          Admin_Console
        </div>
        <nav className={styles.navGroup} aria-label="Admin Main Menu">
          <NavLink to="/admin" end className={getLinkClass} onClick={closeSidebar}>
            / Dashboard
          </NavLink>
          <NavLink to="/admin/personas" className={getLinkClass} onClick={closeSidebar}>
            / Personas
          </NavLink>
          <NavLink to="/admin/skills" className={getLinkClass} onClick={closeSidebar}>
            / Skill_Matrix
          </NavLink>
          <NavLink to="/admin/projects" className={getLinkClass} onClick={closeSidebar}>
            / Projects
          </NavLink>
          <NavLink to="/admin/achievements" className={getLinkClass} onClick={closeSidebar}>
            / Timeline_Feed
          </NavLink>
          <NavLink to="/admin/activity" className={getLinkClass} onClick={closeSidebar}>
            / System_Logs
          </NavLink>
        </nav>
        <div className={styles.backLinkWrapper}>
          <Link to="/" className={styles.backLink}>
            ← Eject to Public Site
          </Link>
        </div>
      </aside>

      {/* Main panel */}
      <div className={styles.mainWrapper}>
        <header className={styles.topHeader}>
          <button
            className={styles.mobileToggle}
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            tabIndex={0}
          >
            [::]
          </button>
          <span className={styles.headerTitle}>System Configuration</span>
          <div className={styles.userBadge} style={{ marginLeft: "auto" }}>
            USER: <strong>{user?.role?.toUpperCase() || "ADMIN"}</strong>
            {" / "}
            <span>{user?.email}</span>
            <button
              className={styles.logoutBtn}
              onClick={() => { logout(); navigate("/auth/login"); }}
              title="Logout"
              style={{ marginLeft: 12 }}
            >
              Logout
            </button>
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