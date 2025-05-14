
import { toast } from "sonner";

/**
 * Εμφανίζει ομαδοποιημένα σφάλματα σε ένα toast και στην κονσόλα
 */
export function displayGroupedErrors(errors: (Error | string)[]) {
  if (errors.length === 0) return;

  // Δημιουργία τίτλου με βάση τον αριθμό των σφαλμάτων
  const title = errors.length === 1 
    ? "Εντοπίστηκε ένα σφάλμα" 
    : `Εντοπίστηκαν ${errors.length} σφάλματα`;
  
  // Δημιουργία σύντομης περιγραφής των σφαλμάτων
  const description = errors.map(err => 
    typeof err === 'string' ? err : err.message
  ).join('\n');
  
  // Εμφάνιση toast με όλα τα σφάλματα
  toast.error(title, {
    description: description.length > 200 
      ? description.substring(0, 200) + '...' 
      : description,
    duration: 6000,
    action: {
      label: "Λεπτομέρειες",
      onClick: () => {
        console.group("Λεπτομέρειες σφαλμάτων");
        errors.forEach((error, index) => {
          console.error(`Σφάλμα ${index + 1}:`, error);
        });
        console.groupEnd();
      }
    }
  });
  
  // Καταγραφή όλων των σφαλμάτων στην κονσόλα
  console.group("Ομαδοποιημένα σφάλματα");
  errors.forEach((error, index) => {
    console.error(`Σφάλμα ${index + 1}:`, error);
  });
  console.groupEnd();
  
  // Αποθήκευση των σφαλμάτων για αποστολή στο chat αν χρειαστεί
  const formattedErrors = errors.map(err => {
    const errorObj = typeof err === 'string' ? new Error(err) : err;
    return {
      message: errorObj.message,
      stack: errorObj.stack,
      timestamp: new Date().toISOString()
    };
  });
  
  try {
    localStorage.setItem('grouped_errors', JSON.stringify(formattedErrors));
  } catch (e) {
    console.error('Σφάλμα κατά την αποθήκευση ομαδοποιημένων σφαλμάτων:', e);
  }
}
