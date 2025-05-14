
/**
 * Χειρισμός πολλαπλών σφαλμάτων και ομαδική εμφάνιση
 */
import { toast } from "sonner";

export function displayGroupedErrors(errors: Error[]): void {
  if (!errors || errors.length === 0) return;
  
  // Ομαδοποίηση παρόμοιων σφαλμάτων
  const groupedErrors: Record<string, { count: number, error: Error }> = {};
  
  errors.forEach(error => {
    const key = error.message;
    if (groupedErrors[key]) {
      groupedErrors[key].count++;
    } else {
      groupedErrors[key] = { count: 1, error };
    }
  });
  
  // Εμφάνιση των ομαδοποιημένων σφαλμάτων
  Object.values(groupedErrors).forEach(({ count, error }) => {
    const message = count > 1 ? 
      `${error.message} (${count} εμφανίσεις)` : 
      error.message;
    
    toast.error("Σφάλμα εφαρμογής", {
      description: message,
      duration: 5000,
    });
  });
}
