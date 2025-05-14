
import { ErrorData } from './types';

/**
 * Διαχειριστής για τη συλλογή και καταγραφή σφαλμάτων
 */
export class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 100;
  
  /**
   * Καταγράφει ένα σφάλμα στη συλλογή
   */
  public reportError(error: Error | string, component: string = 'unknown', details: any = {}): ErrorData {
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? new Error().stack || '' : error.stack || '';
    const source = typeof error === 'string' ? 'manual' : error.name || 'error';
    
    const errorData: ErrorData = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      stack,
      component,
      source,
      details,
      timestamp: new Date().toISOString()
    };
    
    // Προσθήκη στη λίστα σφαλμάτων
    this.errors.unshift(errorData);
    
    // Διατήρηση μέγιστου αριθμού σφαλμάτων
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
    
    // Καταγραφή στην κονσόλα για διευκόλυνση του debugging
    console.error(`[${errorData.component}] ${errorData.message}`, details);
    
    return errorData;
  }

  /**
   * Καταγράφει ένα σφάλμα με περισσότερες λεπτομέρειες και το αποθηκεύει (αν υπάρχει backend)
   */
  public async captureError(error: Error, options?: { component?: string, details?: any, source?: string, method?: string }): Promise<ErrorData> {
    const { component = 'unknown', details = {}, source = 'client', method } = options || {};
    
    // Δημιουργία του error entry
    const errorData = this.reportError(error, component, {
      ...details,
      method
    });
    
    try {
      // Εδώ θα γινόταν αποστολή του σφάλματος σε κάποιο backend
      // ή θα αποθηκευόταν σε κάποιο persistent storage
      console.info('Error captured and ready for storage:', errorData);
    } catch (storingError) {
      console.error('Failed to store error:', storingError);
    }
    
    return errorData;
  }

  /**
   * Επιστρέφει όλα τα καταγεγραμμένα σφάλματα
   */
  public getAllErrors(): ErrorData[] {
    return [...this.errors];
  }

  /**
   * Καθαρίζει όλα τα καταγεγραμμένα σφάλματα
   */
  public clearAllErrors(): void {
    this.errors = [];
    console.log('All errors cleared from the collector');
  }
  
  // Aliases για συμβατότητα με παλαιότερο κώδικα
  public getErrors = this.getAllErrors;
  public clearErrors = this.clearAllErrors;
}

export const errorCollector = new ErrorCollector();
export type { ErrorData };
