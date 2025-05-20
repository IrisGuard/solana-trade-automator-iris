
import React from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { AppInitializer } from "@/components/AppInitializer";

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000, // 1 minute
      meta: {
        errorHandler: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
    mutations: {
      // Add better error handling for mutations
      onError: (error: Error) => {
        console.error('Mutation error:', error);
      }
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
        <LanguageProvider defaultLanguage="el">
          <SupabaseAuthProvider>
            <AppInitializer>
              {children}
            </AppInitializer>
          </SupabaseAuthProvider>
          <Toaster position="top-right" richColors />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
