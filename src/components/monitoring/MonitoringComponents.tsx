
import { useEffect } from "react";
import { toast } from "sonner";
import { useConsoleErrorMonitor } from "@/hooks/useConsoleErrorMonitor";
import { useErrorDialogInChat } from "@/components/debug/ErrorDialogInChat";
import { displayError } from "@/utils/error-handling/displayError";
import { errorCollector } from "@/utils/error-handling/collector";

// Component που παρακολουθεί για σφάλματα κονσόλας
export function ErrorMonitor() {
  useConsoleErrorMonitor();
  return null;
}

// Component για την εμφάνιση των διαλογικών παραθύρων σφάλματος
export function ErrorDialogsRenderer() {
  const { ErrorDialogs } = useErrorDialogInChat();
  return <ErrorDialogs />;
}

// Component που παρακολουθεί την κατάσταση του δικτύου
export function NetworkErrorDetector() {
  useEffect(() => {
    // Παρακολούθηση για σφάλματα δικτύου
    const handleOnline = () => {
      toast.success("Επανασύνδεση δικτύου", {
        description: "Η σύνδεση στο διαδίκτυο αποκαταστάθηκε"
      });
    };

    const handleOffline = () => {
      toast.error("Απώλεια δικτύου", {
        description: "Η σύνδεση στο διαδίκτυο διακόπηκε. Ελέγξτε τη σύνδεσή σας.",
        duration: 0 // Μόνιμο μέχρι να επανασυνδεθεί
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}

// Component που ελέγχει για σφάλματα δημοσίευσης
export function PublishErrorMonitor() {
  useEffect(() => {
    // Έλεγχος για σφάλματα κατά τη δημοσίευση
    const handlePublishErrors = () => {
      try {
        // Έλεγχος αν βρισκόμαστε σε περιβάλλον production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          console.log("Εκτελείται έλεγχος για σφάλματα δημοσίευσης...");
          
          // Έλεγχος Supabase σύνδεσης
          fetch('https://lvkbyfocssuzcdphpmfu.supabase.co/rest/v1/', {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc'
            }
          })
            .then(response => {
              if (!response.ok) throw new Error("Αδυναμία σύνδεσης με το Supabase");
              console.log("Επιτυχής σύνδεση με το Supabase");
            })
            .catch(error => {
              displayError(error, {
                toastTitle: "Σφάλμα κατά τη δημοσίευση",
                showToast: true,
                logToConsole: true,
                sendToChat: true,
                useCollector: true
              });
            });
            
          // Άλλοι έλεγχοι που μπορείτε να προσθέσετε...
        }
      } catch (e) {
        console.error("Σφάλμα κατά τον έλεγχο σφαλμάτων δημοσίευσης:", e);
        errorCollector.captureError(e instanceof Error ? e : new Error(String(e)), {
          component: 'PublishErrorMonitor',
          source: 'client'
        });
      }
    };
    
    // Εκτέλεση του ελέγχου μετά από λίγο για να επιτρέψουμε στην εφαρμογή να φορτώσει πλήρως
    const timer = setTimeout(handlePublishErrors, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return null;
}

// Συγκεντρωτικό component για όλα τα monitoring components
export function MonitoringSystem() {
  return (
    <>
      <ErrorMonitor />
      <ErrorDialogsRenderer />
      <NetworkErrorDetector />
      <PublishErrorMonitor />
    </>
  );
}
