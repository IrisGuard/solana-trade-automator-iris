
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateErrorCode } from "@/components/debug/error-dialog/errorCodeUtils";

export interface ErrorDetails {
  message: string;
  stack?: string;
  component?: string;
  source?: 'client' | 'server' | 'network';
  url?: string;
  browserInfo?: {
    userAgent?: string;
    language?: string;
    platform?: string;
    [key: string]: any;
  };
  timestamp?: Date;
  code?: string;
}

/**
 * Κλάση για τη συλλογή και αποθήκευση σφαλμάτων για μαζική υποβολή
 */
export class ErrorCollector {
  private errors: ErrorDetails[] = [];
  private maxErrorsToStore: number = 50;
  private readonly persistenceKey = 'stored_errors';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Προσθέτει ένα σφάλμα στη συλλογή
   */
  addError(error: Omit<ErrorDetails, 'timestamp' | 'code'>): string {
    const errorCode = generateErrorCode();
    
    const errorWithDetails: ErrorDetails = {
      ...error,
      timestamp: new Date(),
      code: errorCode
    };
    
    // Προσθήκη στην τοπική συλλογή
    this.errors.push(errorWithDetails);
    
    // Διασφάλιση ότι δεν ξεπερνάμε το μέγιστο αριθμό
    if (this.errors.length > this.maxErrorsToStore) {
      this.errors.shift(); // Αφαίρεση του παλαιότερου σφάλματος
    }
    
    // Αποθήκευση στο localStorage
    this.saveToStorage();
    
    return errorCode;
  }

  /**
   * Επιστρέφει τη λίστα με όλα τα σφάλματα που έχουν συλλεχθεί
   */
  getErrors(): ErrorDetails[] {
    return [...this.errors];
  }

  /**
   * Αποθηκεύει τα σφάλματα στο localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.persistenceKey, JSON.stringify(this.errors));
    } catch (error) {
      console.error('Αδυναμία αποθήκευσης σφαλμάτων στο localStorage:', error);
    }
  }

  /**
   * Φορτώνει τα αποθηκευμένα σφάλματα από το localStorage
   */
  private loadFromStorage(): void {
    try {
      const storedErrors = localStorage.getItem(this.persistenceKey);
      if (storedErrors) {
        this.errors = JSON.parse(storedErrors);
        
        // Μετατροπή των timestamp strings σε Date objects
        this.errors.forEach(error => {
          if (typeof error.timestamp === 'string') {
            error.timestamp = new Date(error.timestamp);
          }
        });
      }
    } catch (error) {
      console.error('Αδυναμία φόρτωσης σφαλμάτων από το localStorage:', error);
      this.errors = [];
    }
  }

  /**
   * Καθαρίζει όλα τα αποθηκευμένα σφάλματα
   */
  clearErrors(): void {
    this.errors = [];
    this.saveToStorage();
  }

  /**
   * Υποβάλλει τα σφάλματα στο Supabase
   */
  async submitToSupabase(): Promise<boolean> {
    try {
      if (this.errors.length === 0) {
        console.log('Δεν υπάρχουν σφάλματα για υποβολή');
        return false;
      }
      
      // Υποβάλλουμε ένα-ένα τα σφάλματα καθώς η συνάρτηση log_error δέχεται μόνο ένα σφάλμα κάθε φορά
      for (const err of this.errors) {
        const { error } = await supabase.rpc('log_error', {
          p_error_message: err.message,
          p_error_stack: err.stack || null,
          p_component: err.component || null,
          p_source: err.source || 'client',
          p_url: err.url || null,
          p_browser_info: err.browserInfo || null
        });
        
        if (error) {
          console.error('Σφάλμα κατά την υποβολή σφάλματος στο Supabase:', error);
          return false;
        }
      }
      
      // Καθαρισμός μετά την επιτυχή υποβολή
      this.clearErrors();
      return true;
    } catch (error) {
      console.error('Σφάλμα κατά την υποβολή σφαλμάτων:', error);
      return false;
    }
  }

  // Προσθήκη της μεθόδου reportErrors
  async reportErrors(): Promise<boolean> {
    if (this.errors.length === 0) {
      console.log('Δεν υπάρχουν σφάλματα για αναφορά');
      return true;
    }
    
    console.log(`Αναφορά ${this.errors.length} σφαλμάτων στο Supabase`);
    const result = await this.submitToSupabase();
    
    if (result) {
      toast.success(`${this.errors.length} σφάλματα υποβλήθηκαν επιτυχώς`);
    } else {
      toast.error('Σφάλμα κατά την αναφορά των σφαλμάτων');
    }
    
    return result;
  }

  async logErrorAndNotify(error: Error, component?: string): Promise<string> {
    const errorCode = this.addError({
      message: error.message,
      stack: error.stack,
      component,
      source: 'client',
      url: window.location.href,
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      }
    });
    
    toast.error(`Σφάλμα: ${error.message}`, {
      description: `Κωδικός σφάλματος: ${errorCode}`
    });
    
    return errorCode;
  }
}

// Εξαγωγή singleton instance για όλη την εφαρμογή
export const errorCollector = new ErrorCollector();
