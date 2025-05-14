
import { ErrorData } from './types';

/**
 * Κλάση που συλλέγει και διαχειρίζεται σφάλματα
 */
export class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 50;
  
  /**
   * Προσθέτει νέο σφάλμα στη συλλογή
   */
  public reportError(error: Error | string, component?: string, details?: any, source: string = 'client'): ErrorData {
    const errorData: ErrorData = this.createErrorData(error, component, details, source);
    
    // Προσθήκη στην αρχή της συλλογής
    this.errors.unshift(errorData);
    
    // Διατήρηση μόνο των maxErrors πιο πρόσφατων σφαλμάτων
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
    
    // Καταγραφή στην κονσόλα
    console.error('[ErrorCollector]', errorData);
    
    return errorData;
  }
  
  /**
   * Δημιουργεί ένα αντικείμενο ErrorData από ένα σφάλμα
   */
  private createErrorData(error: Error | string, component?: string, details?: any, source: string = 'client'): ErrorData {
    const now = new Date();
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? '' : error.stack || '';
    
    return {
      id: crypto.randomUUID(),
      message: errorMessage,
      stack: errorStack,
      component: component || 'unknown',
      source,
      details,
      timestamp: now.toISOString()
    };
  }
  
  /**
   * Επιστρέφει όλα τα σφάλματα
   */
  public getErrors(): ErrorData[] {
    return [...this.errors];
  }
  
  /**
   * Επιστρέφει το πιο πρόσφατο σφάλμα
   */
  public getLatestError(): ErrorData | null {
    return this.errors.length > 0 ? this.errors[0] : null;
  }
  
  /**
   * Καθαρίζει όλα τα σφάλματα
   */
  public clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Καταγράφει σφάλμα στο Supabase
   */
  public async captureError(error: Error, options: { component?: string, details?: any, source?: string } = {}): Promise<string> {
    const errorData = this.reportError(error, options.component, options.details, options.source || 'client');
    
    // Εδώ θα μπορούσαμε να στείλουμε το σφάλμα σε κάποια υπηρεσία καταγραφής
    console.log('Σφάλμα καταγράφηκε:', errorData);
    
    return errorData.id;
  }
}

export const errorCollector = new ErrorCollector();

export type { ErrorData } from './types';
