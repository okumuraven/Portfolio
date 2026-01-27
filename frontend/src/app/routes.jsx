import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/public/PublicLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import Home from "../pages/public/Home/Home";
// Example admin pages can be stubbed for now
// import Dashboard from "../pages/admin/Dashboard/Dashboard";

// If you don't have an Admin Dashboard created yet, use a stub:
function AdminDashboardStub() {
  return <div>Admin Dashboard Coming Soon!</div>;
}

/**
 * Centralized Routing for App
 * - Splits public routes and admin routes using layouts
 * - Add additional routes as features are built
 * - 404 fallback included
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        {/* Add other public pages here */}
        {/* Example: 
        <Route path="projects" element={<Projects />} />
        <Route path="timeline" element={<Timeline />} />
        */}
      </Route>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardStub />} />
        {/* Add other admin pages here */}
        {/* Example:
        <Route path="roles" element={<Roles />} />
        <Route path="skills" element={<Skills />} />
        */}
      </Route>
      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/**
 * Simple 404 Not Found page component.
 */
function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1>404</h1>
      <p>Sorry, the page you’re looking for does not exist.</p>
      <a href="/" style={{ color: "#4134e4" }}>Back to Home</a>
    </div>
  );
}