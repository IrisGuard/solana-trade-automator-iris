
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="container flex max-w-md flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-muted p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
            <path d="M2 7h20"/>
            <path d="m9 10 3 3 3-3"/>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
        <p className="text-xl">Η σελίδα δεν βρέθηκε</p>
        <p className="text-muted-foreground">
          Συγγνώμη, δεν μπορέσαμε να βρούμε τη σελίδα που ψάχνετε: {location.pathname}
        </p>
        <Button asChild variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <a href="/">Επιστροφή στο Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
