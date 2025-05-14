
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateErrorCode } from '@/components/debug/error-dialog/errorCodeUtils';

export interface ErrorData {
  message: string;
  stack?: string;
  component?: string;
  source?: string;
  url?: string;
  browserInfo?: Record<string, any>;
  timestamp?: number;
  code?: string;
}

export class ErrorCollector {
  private errors: ErrorData[] = [];
  private userId: string | null = null;
  private isSubmitting = false;
  private maxErrors = 10;

  constructor() {
    this.errors = [];
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  addError(error: ErrorData) {
    // Προσθήκη κωδικού σφάλματος και timestamp αν δεν υπάρχουν
    const errorWithMetadata = {
      ...error,
      timestamp: error.timestamp || Date.now(),
      code: error.code || generateErrorCode()
    };

    // Περιορισμός του αριθμού των αποθηκευμένων σφαλμάτων
    if (this.errors.length >= this.maxErrors) {
      this.errors.shift(); // Αφαίρεση του παλαιότερου σφάλματος
    }

    this.errors.push(errorWithMetadata);
    console.error('Error added to collector:', errorWithMetadata);

    return errorWithMetadata.code;
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }

  async submitToSupabase() {
    if (this.isSubmitting || this.errors.length === 0) {
      return;
    }

    this.isSubmitting = true;

    try {
      const errorsToSubmit = this.errors.map(error => ({
        user_id: this.userId,
        error_message: error.message,
        error_stack: error.stack,
        component: error.component,
        source: error.source || 'client',
        url: error.url || window.location.href,
        browser_info: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          timestamp: error.timestamp,
          code: error.code,
          ...(error.browserInfo || {})
        }
      }));

      const { error } = await supabase.from('error_logs').insert(errorsToSubmit);

      if (error) {
        console.error('Error submitting to Supabase:', error);
        return false;
      }

      // Καθαρισμός της λίστας μετά από επιτυχή αποστολή
      this.clearErrors();
      return true;
    } catch (err) {
      console.error('Exception in submitToSupabase:', err);
      return false;
    } finally {
      this.isSubmitting = false;
    }
  }

  // Προσθήκη της μεθόδου reportErrors που λείπει
  async reportErrors() {
    if (this.errors.length === 0) {
      console.log('No errors to report');
      return;
    }
    
    console.log(`Reporting ${this.errors.length} errors to Supabase`);
    const result = await this.submitToSupabase();
    
    if (result) {
      toast.success(`${this.errors.length} σφάλματα υποβλήθηκαν επιτυχώς`);
    } else {
      toast.error('Σφάλμα κατά την αναφορά των σφαλμάτων');
    }
    
    return result;
  }

  async logErrorAndNotify(error: Error, component?: string) {
    const errorCode = this.addError({
      message: error.message,
      stack: error.stack,
      component,
      url: window.location.href
    });

    toast.error(`Παρουσιάστηκε σφάλμα (${errorCode})`, {
      description: "Το σφάλμα έχει καταγραφεί και θα διορθωθεί σύντομα.",
      duration: 5000,
    });

    await this.submitToSupabase();
  }
}

// Singleton instance
export const errorCollector = new ErrorCollector();
