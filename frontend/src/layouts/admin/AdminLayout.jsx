import React, { useEffect, useState, useCallback } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout() {
  const { user, fetchUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Fetch user (once) on mount if not already loaded
  useEffect(() => {
    if (user === undefined) fetchUser();
  }, [user, fetchUser]);

  // Redirect to login if NOT authenticated
  useEffect(() => {
    if (user === null) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, navigate]);

  // Sidebar toggle handlers w/esc to close
  const toggleSidebar = useCallback(() => setSidebarOpen(open => !open), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleEsc = (e) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isSidebarOpen]);

  const getLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  // Early returns
  if (user === undefined) return <div>Loading...</div>;

  return (
    <div className={styles.layoutWrapper}>
      {/* MOBILE OVERLAY */}
      <div
        className={`${styles.overlay} ${isSidebarOpen ? styles.overlayOpen : ""}`}
        onClick={closeSidebar}
        aria-label="Close sidebar"
        role="button"
        tabIndex={0}
        onKeyPress={e => { if (e.key === "Enter") closeSidebar(); }}
      />

      {/* SIDEBAR */}
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

      {/* MAIN VIEW */}
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