
import { toast } from 'sonner';

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,         // Μειωμένες επαναπροσπάθειες από 5 σε 3
  initialDelay: 2000,    // Αυξημένο από 1500ms σε 2000ms
  maxDelay: 10000,       // Μειωμένο από 15000ms σε 10000ms
  backoffFactor: 1.5     // Μειωμένο από 2 σε 1.5
};

// Μητρώο για την παρακολούθηση των επαναπροσπαθειών ανά endpoint
const retryRegistry = new Map<string, {
  lastAttempt: number;
  attempts: number;
  inProgress: boolean;
}>();

// Έλεγχος αν ένα σφάλμα οφείλεται σε rate limiting
export function isRateLimitError(error: unknown): boolean {
  const errorStr = String(error);
  return errorStr.includes('rate limit') || 
         errorStr.includes('429') || 
         errorStr.includes('-32429') ||
         errorStr.includes('Too many requests') ||
         errorStr.includes('exceeded') && errorStr.includes('limit');
}

// Παράκαμψη για δοκιμές: ελέγχουμε αν έχουμε πολύ πρόσφατη κλήση στο ίδιο endpoint
function shouldSkipRequest(endpoint: string): boolean {
  const info = retryRegistry.get(endpoint);
  if (!info) return false;
  
  const now = Date.now();
  // Αν έχει περάσει λιγότερο από 3 δευτερόλεπτα από την τελευταία αποτυχημένη προσπάθεια
  // και έχουμε ήδη κάνει τουλάχιστον 2 προσπάθειες, παραλείπουμε το αίτημα
  return (now - info.lastAttempt < 3000 && info.attempts >= 2);
}

// Καταγραφή αποτυχημένης προσπάθειας
function recordFailedAttempt(endpoint: string) {
  const info = retryRegistry.get(endpoint) || { lastAttempt: 0, attempts: 0, inProgress: false };
  info.lastAttempt = Date.now();
  info.attempts += 1;
  retryRegistry.set(endpoint, info);
}

// Καταγραφή επιτυχημένης προσπάθειας
function recordSuccessfulAttempt(endpoint: string) {
  retryRegistry.delete(endpoint);
}

/**
 * Εκτέλεση συνάρτησης με αυτόματη επαναπροσπάθεια για σφάλματα Rate Limit
 */
export async function withRateLimitRetry<T>(
  fn: () => Promise<T>, 
  options: Partial<RetryConfig> & { endpoint?: string } = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...options };
  const endpoint = options.endpoint || 'default';
  
  // Έλεγχος αν πρέπει να παραλείψουμε το αίτημα και να επιστρέψουμε αμέσως σφάλμα
  if (shouldSkipRequest(endpoint)) {
    console.warn(`Skipping request to ${endpoint} due to recent rate limit errors`);
    throw new Error("Παραλείπεται το αίτημα λόγω πρόσφατων περιορισμών ρυθμού (rate limit)");
  }
  
  // Κλείδωμα αυτού του endpoint για να αποφύγουμε παράλληλα αιτήματα
  const info = retryRegistry.get(endpoint) || { lastAttempt: 0, attempts: 0, inProgress: false };
  if (info.inProgress) {
    console.warn(`Request to ${endpoint} already in progress, skipping duplicate`);
    throw new Error("Παράλληλο αίτημα παραλείπεται");
  }
  
  info.inProgress = true;
  retryRegistry.set(endpoint, info);
  
  let delay = config.initialDelay;
  let attempt = 0;
  
  try {
    while (true) {
      try {
        const result = await fn();
        recordSuccessfulAttempt(endpoint);
        return result;
      } catch (error) {
        attempt++;
        const isRateLimitDetected = isRateLimitError(error);
        
        // Αν δεν είναι σφάλμα rate limit ή έχουμε υπερβεί τις προσπάθειες, προωθούμε το σφάλμα
        if (!isRateLimitDetected || attempt >= config.maxRetries) {
          if (isRateLimitDetected) {
            recordFailedAttempt(endpoint);
            console.warn(`Rate limit persists after ${attempt} attempts. Giving up.`);
            
            // Εμφανίζουμε ένα μόνο toast μήνυμα αντί για πολλαπλά
            if (attempt === 1) {
              toast.error('Solana API rate limit exceeded. Please try again later.', {
                description: 'The application will use cached data if available.',
                id: `rate-limit-${endpoint}`, // Unique ID για να αποφύγουμε διπλά μηνύματα
                duration: 5000
              });
            }
          }
          throw error;
        }
        
        recordFailedAttempt(endpoint);
        console.log(`Rate limit hit. Retrying in ${delay}ms (attempt ${attempt}/${config.maxRetries})`);
        
        // Εμφανίζουμε μήνυμα toast μόνο στην πρώτη προσπάθεια επανάληψης
        if (attempt === 1) {
          toast.info('API rate limit exceeded. Retrying automatically...', {
            id: `rate-limit-retry-${endpoint}`,
            duration: 3000
          });
        }
        
        // Αναμονή πριν την επόμενη προσπάθεια
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Αύξηση καθυστέρησης για την επόμενη προσπάθεια (εκθετική αύξηση)
        delay = Math.min(delay * config.backoffFactor, config.maxDelay);
      }
    }
  } finally {
    // Βεβαιωνόμαστε ότι απελευθερώνουμε το κλείδωμα
    const currentInfo = retryRegistry.get(endpoint);
    if (currentInfo) {
      currentInfo.inProgress = false;
      retryRegistry.set(endpoint, currentInfo);
    }
  }
}

/**
 * Χειρισμός σφαλμάτων rate limit με φιλικό UI
 */
export function handleRateLimitError(error: unknown, fallbackValue: any = null): any {
  if (isRateLimitError(error)) {
    console.warn('Rate limit error handled:', error);
    
    // Χρησιμοποιούμε ένα μοναδικό ID για το toast ώστε να μην εμφανίζονται πολλά
    toast.error('Solana API rate limit exceeded', {
      description: 'Please try again in a moment.',
      position: 'top-center',
      duration: 5000,
      id: 'global-rate-limit'
    });
    
    return fallbackValue;
  }
  throw error;
}

