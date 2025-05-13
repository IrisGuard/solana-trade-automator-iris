
/**
 * Utility για τη συλλογή και αποστολή πολλαπλών σφαλμάτων μαζί
 */
import { toast } from "sonner";
import { displayGroupedErrors } from "./errorUtils";

// Διάστημα ομαδοποίησης σφαλμάτων (ms)
const ERROR_GROUPING_INTERVAL = 2000;

class ErrorCollector {
  private errors: (Error | string)[] = [];
  private timeoutId: number | null = null;

  /**
   * Προσθέτει ένα σφάλμα στη συλλογή και προγραμματίζει την αποστολή τους
   * @param error Το σφάλμα που προέκυψε
   */
  addError(error: Error | string) {
    // Προσθήκη του σφάλματος στη συλλογή
    this.errors.push(error);
    
    // Εμφάνιση badge για τον αριθμό των σφαλμάτων
    this.updateErrorCountBadge();
    
    // Ακυρώνουμε τυχόν υπάρχοντα χρονοδιακόπτη
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
    }
    
    // Προγραμματίζουμε νέα αποστολή
    this.timeoutId = window.setTimeout(() => {
      this.sendCollectedErrors();
    }, ERROR_GROUPING_INTERVAL);
  }
  
  /**
   * Ενημερώνει το badge αριθμού σφαλμάτων
   */
  private updateErrorCountBadge() {
    // Αν υπάρχουν σφάλματα, εμφανίζουμε toast με τον αριθμό τους
    if (this.errors.length > 1) {
      // Εμφανίζουμε μικρό toast με τον αριθμό των σφαλμάτων
      toast.error(`${this.errors.length} σφάλματα σε αναμονή`, {
        description: "Πατήστε για άμεση αποστολή",
        duration: 3000,
        action: {
          label: "Αποστολή τώρα",
          onClick: () => this.sendCollectedErrors()
        }
      });
    }
  }
  
  /**
   * Αποστέλλει όλα τα συλλεγμένα σφάλματα μαζί
   */
  sendCollectedErrors() {
    if (this.errors.length === 0) return;
    
    // Αν υπάρχει χρονοδιακόπτης, τον ακυρώνουμε
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    // Αντιγράφουμε τα σφάλματα και καθαρίζουμε τη συλλογή
    const errorsToSend = [...this.errors];
    this.errors = [];
    
    // Αποστολή των σφαλμάτων μαζί
    displayGroupedErrors(errorsToSend);
  }
  
  /**
   * Καθαρίζει όλα τα συλλεγμένα σφάλματα
   */
  clearErrors() {
    // Ακυρώνουμε τυχόν χρονοδιακόπτη
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    // Καθαρίζουμε τη συλλογή
    this.errors = [];
  }
}

// Εξαγωγή μοναδικής περίπτωσης του ErrorCollector
export const errorCollector = new ErrorCollector();
