import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ThemeProvider } from 'path-to-theme-provider' // Uncomment when using a global theme
import { AuthProvider } from '../hooks/useAuth'; // <-- Adjust path if needed

// React Query client instance
const queryClient = new QueryClient();

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ---- Add a global ThemeProvider if you have persona-based themes ---- */}
      {/* <ThemeProvider> */}
      <AuthProvider>
        {children}
      </AuthProvider>
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}