// src/app/providers.jsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ThemeProvider } from 'path-to-theme-provider'
// If you have a ready AuthProvider, import it:
import { AuthProvider } from '../hooks/useAuth'; // Adjust the path as needed

const queryClient = new QueryClient();

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* If you have ThemeProvider, uncomment and wrap */}
      {/* <ThemeProvider> */}
      {/* If you have AuthProvider, add it here */}
      <AuthProvider>
        {children}
      </AuthProvider>
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}