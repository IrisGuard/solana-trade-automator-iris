import React from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "@/lib/router-exports";
import { SupabaseAuthProvider } from "@/providers/SupabaseAuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { GlobalErrorHandler } from "@/components/errors/GlobalErrorHandler";
import { displayError } from "@/utils/errorUtils";
import { RateLimitProvider } from '@/components/notifications/RateLimitNotification';

// Δημιουργία του QueryClient με προεπιλεγμένες ρυθμίσεις
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        meta: {
          // Move error handling logic to the meta object
          onError: (error: Error) => {
            displayError(error, {
              title: "Σφάλμα αιτήματος δεδομένων",
              showToast: true,
              logToConsole: true,
              sendToChat: true,
              useCollector: true
            });
          }
        }
      },
    },
  });
};

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const queryClient = React.useMemo(() => createQueryClient(), []);

  return (
    <GlobalErrorHandler>
      <ThemeProvider defaultTheme="system">
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <SupabaseAuthProvider>
                <RateLimitProvider>
                  {children}
                </RateLimitProvider>
              </SupabaseAuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GlobalErrorHandler>
  );
}
