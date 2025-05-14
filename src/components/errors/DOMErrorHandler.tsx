
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { applyAllDOMPatches } from '@/utils/domPatches';

export function DOMErrorHandler() {
  useEffect(() => {
    // Εφαρμογή του patch κατά την πρώτη render
    applyAllDOMPatches();
    
    // Ορισμός global error handler για σφάλματα DOM
    const handleError = (event: ErrorEvent) => {
      if (event.error && 
          (event.error.message?.includes('removeChild') || 
           event.error.message?.includes('appendChild'))) {
        
        console.warn('Εντοπίστηκε σφάλμα DOM (πιθανώς λόγω επέκτασης προγράμματος περιήγησης):', event.error);
        
        // Εμφάνιση μηνύματος στον χρήστη
        toast.error("Εντοπίστηκε πρόβλημα DOM", {
          description: "Αυτό μπορεί να οφείλεται σε επεκτάσεις του προγράμματος περιήγησης όπως το Google Translate.",
          duration: 5000
        });
        
        // Αποτρέπουμε τη διάδοση του σφάλματος
        event.preventDefault();
        event.stopPropagation();
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  return null; // Αυτό το component δεν εμφανίζει UI
}
