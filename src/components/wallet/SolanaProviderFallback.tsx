
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SolanaProviderFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  children?: React.ReactNode;
}

export function SolanaProviderFallback({
  error,
  resetErrorBoundary,
  children
}: SolanaProviderFallbackProps) {
  if (!error) return <>{children}</>;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-2">
        <div>Σφάλμα σύνδεσης με το Solana Wallet</div>
        <div className="text-sm">
          Βεβαιωθείτε ότι έχετε εγκαταστήσει το Phantom Wallet ή άλλο συμβατό wallet και προσπαθήστε ξανά.
        </div>
        {resetErrorBoundary && (
          <button 
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground rounded text-sm mt-2 w-fit"
          >
            Επαναφορά
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
