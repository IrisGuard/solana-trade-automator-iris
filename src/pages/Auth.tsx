
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Επιβεβαίωση ότι ο χρήστης ανακατευθύνεται σωστά
    console.log('Auth page loaded, redirecting to home page');
    navigate('/', { replace: true });
    toast.success('Καλώς ήρθατε στο Solana Trade Automator');
  }, [navigate]);

  // Εμφάνιση μηνύματος φόρτωσης κατά τη διάρκεια της ανακατεύθυνσης
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Solana Trade Automator</h1>
        <p className="text-muted-foreground mb-4">Φόρτωση εφαρμογής...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default Auth;
