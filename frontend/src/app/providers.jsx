import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ThemeProvider } from 'path-to-theme-provider'

const queryClient = new QueryClient();

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider> */}
      {children}
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}