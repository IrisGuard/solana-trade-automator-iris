
import { toast } from 'sonner';

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
};

/**
 * Συνάρτηση που εκτελεί μια εργασία με αυτόματες επαναπροσπάθειες για σφάλματα Rate Limit
 */
export async function withRateLimitRetry<T>(
  fn: () => Promise<T>, 
  options: Partial<RetryConfig> = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...options };
  let delay = config.initialDelay;
  let attempt = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      const errorStr = String(error);
      const isRateLimitError = errorStr.includes('rate limit') || errorStr.includes('429');
      
      // Αν δεν είναι σφάλμα rate limit ή έχουμε ξεπεράσει τις προσπάθειες, προωθούμε το σφάλμα
      if (!isRateLimitError || attempt >= config.maxRetries) {
        throw error;
      }
      
      console.log(`Rate limit hit. Retrying in ${delay}ms (attempt ${attempt}/${config.maxRetries})`);
      
      // Ενημέρωση χρήστη μόνο στην πρώτη προσπάθεια
      if (attempt === 1) {
        toast.info('API rate limit exceeded. Retrying automatically...');
      }
      
      // Αναμονή πριν την επόμενη προσπάθεια
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Αύξηση του delay για την επόμενη προσπάθεια (exponential backoff)
      delay = Math.min(delay * config.backoffFactor, config.maxDelay);
    }
  }
}

/**
 * Έλεγχος αν ένα σφάλμα οφείλεται σε περιορισμό ρυθμού (rate limiting)
 */
export function isRateLimitError(error: unknown): boolean {
  const errorStr = String(error);
  return errorStr.includes('rate limit') || 
         errorStr.includes('429') || 
         errorStr.includes('-32429');
}
