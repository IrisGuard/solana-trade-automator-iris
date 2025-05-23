
import React from "react";

interface AppFallbackComponentProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function AppFallbackComponent({ resetErrorBoundary }: AppFallbackComponentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold">Πρόβλημα φόρτωσης</h1>
      <p className="mt-2 text-muted-foreground">Υπήρξε πρόβλημα κατά τη φόρτωση της εφαρμογής Solana Trade Automator.</p>
      <button 
        className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        onClick={() => window.location.reload()}
      >
        Επαναφόρτωση σελίδας
      </button>
      {resetErrorBoundary && (
        <button 
          className="mt-2 text-sm text-primary hover:underline"
          onClick={resetErrorBoundary}
        >
          Δοκιμάστε χωρίς επαναφόρτωση
        </button>
      )}
    </div>
  );
}
