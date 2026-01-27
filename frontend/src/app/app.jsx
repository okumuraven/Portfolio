import React from "react";
import AppProviders from "./providers";
import AppRoutes from "./routes";

/**
 * Application Root Component
 * - Wires up all global providers (theme, query, auth, etc)
 * - Injects all routes (public & admin) using centralized routes config
 * - Handles Error Boundaries and Fallback UI
 */
export default function App() {
  return (
    <React.StrictMode>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </React.StrictMode>
  );
}