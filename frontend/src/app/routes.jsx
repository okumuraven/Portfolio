import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/public/PublicLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import Home from "../pages/public/Home/Home";
import Login from "../pages/public/auth/Login";
import SkillMatrix from "../pages/public/SkillMatrix/SkillMatrix";
import AdminSkillMatrix from "../pages/admin/skill/AdminSkillMatrix";
import PersonasAdminPage from "../pages/admin/Personas";
import ProjectsPage from "../pages/public/Projects/ProjectsPage";
import ProjectsAdminPage from "../pages/admin/Projects/ProjectsAdminPage";
import TimelinePage from "../pages/public/Timeline/TimelinePage";
import TimelineAdmin from "../pages/admin/TimelineAdmin";

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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="skill-matrix" element={<SkillMatrix />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="auth/login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardStub />} />
        <Route path="personas" element={<PersonasAdminPage />} />
        <Route path="skills" element={<AdminSkillMatrix />} />
        <Route path="projects" element={<ProjectsAdminPage />} />
        <Route path="timeline" element={<TimelineAdmin />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}