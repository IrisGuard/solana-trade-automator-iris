
import React from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SupabaseAuthProvider } from "@/providers/SupabaseAuthProvider";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000 // 1 minute
    }
  }
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <SupabaseAuthProvider>
            {children}
          </SupabaseAuthProvider>
          <Toaster position="top-right" richColors />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
