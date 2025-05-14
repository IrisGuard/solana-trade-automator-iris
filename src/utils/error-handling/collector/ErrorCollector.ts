
/**
 * Συλλογή σφαλμάτων για ομαδική επεξεργασία και αναφορά
 */
export class ErrorCollector {
  private errors: Error[] = [];
  private maxErrors: number = 20;
  
  constructor() {
    this.errors = [];
  }
  
  /**
   * Προσθέτει ένα σφάλμα στη συλλογή
   */
  public addError(error: Error): void {
    this.errors.push(error);
    
    // Διατήρηση περιορισμένου αριθμού σφαλμάτων για αποφυγή διαρροής μνήμης
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    
    console.error("Error collected:", error);
  }
  
  /**
   * Επιστρέφει όλα τα συλλεγμένα σφάλματα
   */
  public getErrors(): Error[] {
    return [...this.errors];
  }
  
  /**
   * Καθαρίζει τη συλλογή σφαλμάτων
   */
  public clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Επιστρέφει ένα συγκεκριμένο σφάλμα με βάση τον δείκτη
   */
  public getErrorAt(index: number): Error | undefined {
    return this.errors[index];
  }
  
  /**
   * Επιστρέφει τον αριθμό των συλλεγμένων σφαλμάτων
   */
  public getErrorCount(): number {
    return this.errors.length;
  }
  
  /**
   * Αποστολή όλων των σφαλμάτων για αναφορά
   */
  public reportErrors(): void {
    if (this.errors.length === 0) {
      return;
    }
    
    console.log(`Reporting ${this.errors.length} collected errors`);
    
    // Εδώ θα μπορούσαμε να προσθέσουμε κώδικα για αποστολή σφαλμάτων σε κάποιο σύστημα παρακολούθησης
  }
}
