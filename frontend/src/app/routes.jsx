import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/public/PublicLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import Home from "../pages/public/Home/Home";
import Login from "../pages/public/auth/Login";
import PersonasAdminPage from "../pages/admin/Personas"; // <--- Import your admin personas page!

// Example admin pages -- stubs
function AdminDashboardStub() {
  return <div>Admin Dashboard Coming Soon!</div>;
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1>404</h1>
      <p>Sorry, the page you’re looking for does not exist.</p>
      <a href="/" style={{ color: "#4134e4" }}>Back to Home</a>
    </div>
  );
}

/**
 * Centralized Routing for App
 * - Splits public and admin routes using layouts
 * - 404 fallback included
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="auth/login" element={<Login />} />
        {/* Add other public pages here as you build them */}
        {/* <Route path="projects" element={<Projects />} /> */}
        {/* <Route path="timeline" element={<Timeline />} /> */}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardStub />} />
        <Route path="personas" element={<PersonasAdminPage />} />
        {/* Add other admin features per your structure: */}
        {/* <Route path="skills" element={<SkillsAdminPage />} /> */}
        {/* <Route path="achievements" element={<AchievementsAdminPage />} /> */}
        {/* <Route path="activity" element={<SystemLogsAdminPage />} /> */}
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}