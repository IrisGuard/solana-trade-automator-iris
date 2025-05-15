
import React from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/hooks/use-language";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseAuthProvider } from "@/providers/SupabaseAuthProvider";
import { Toaster } from "sonner";
import { ConsoleMonitor } from "@/components/debug/ConsoleMonitor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster position="top-right" />
            <ConsoleMonitor />
          </LanguageProvider>
        </ThemeProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}
