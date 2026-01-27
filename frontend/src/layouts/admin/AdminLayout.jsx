import React from "react";
import { Outlet, Link } from "react-router-dom";

/**
 * AdminLayout
 * - Provides the shell for all admin/dashboard pages.
 * - Typical: sidebar or topbar navigation, admin content area, and minimal footer.
 * - Uses <Outlet /> for nested admin routes.
 * - All admin logic/layout only; no business logic!
 */
export default function AdminLayout() {
  return (
    <div className="admin-layout" style={{ display: "flex", minHeight: "100vh" }}>
      {/* ==== SIDEBAR ==== */}
      <aside
        className="admin-sidebar"
        style={{
          width: "220px",
          background: "#232446",
          color: "#fff",
          padding: "2rem 1rem",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1.3rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Admin Panel
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <Link to="/admin" style={{ color: "#fff" }}>Dashboard</Link>
          <Link to="/admin/roles" style={{ color: "#fff" }}>Roles</Link>
          <Link to="/admin/skills" style={{ color: "#fff" }}>Skills</Link>
          <Link to="/admin/achievements" style={{ color: "#fff" }}>Achievements</Link>
          <Link to="/admin/activity" style={{ color: "#fff" }}>Activity</Link>
          {/* Add more links as needed */}
        </nav>
        <div style={{ marginTop: "2rem" }}>
          <Link to="/" style={{ color: "#9adccd", fontSize: "0.95rem" }}>
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* ==== MAIN CONTENT ==== */}
      <div className="admin-main" style={{ flex: 1, background: "#f8faff", minHeight: "100vh" }}>
        <header style={{ padding: "1.2rem 2rem", borderBottom: "1px solid #e5e8ee", background: "#fff" }}>
          {/* You can add admin user info, quick actions, or breadcrumbs here */}
          <span style={{ color: "#232446", fontWeight: "bold" }}>Admin Area</span>
        </header>
        <main style={{ padding: "2rem" }}>
          <Outlet />
        </main>
        <footer style={{
          textAlign: "center",
          padding: "1rem 0",
          background: "#fff",
          borderTop: "1px solid #e5e8ee",
          color: "#999",
          fontSize: "0.96rem"
        }}>
          &copy; {new Date().getFullYear()} MyPortfolio Admin
        </footer>
      </div>
    </div>
  );
}