
import { toast } from 'sonner';

// Καταγραφή αιτημάτων ανά endpoint
const requestCounts: Record<string, {
  count: number;
  resetTime: number;
  isRateLimited: boolean;
}> = {};

// Ορισμός ορίων και διάρκειας reset για διάφορα endpoints
const RATE_LIMITS: Record<string, { limit: number, resetPeriod: number }> = {
  default: { limit: 8, resetPeriod: 10000 }, // 8 αιτήματα ανά 10 δευτερόλεπτα
  helius: { limit: 5, resetPeriod: 5000 },   // 5 αιτήματα ανά 5 δευτερόλεπτα
  solscan: { limit: 3, resetPeriod: 5000 }   // 3 αιτήματα ανά 5 δευτερόλεπτα
};

// Διαχείριση rate limit ανά endpoint
export function isRateLimited(endpoint: string): boolean {
  // Έλεγχος αν το endpoint είναι καταγεγραμμένο
  if (!requestCounts[endpoint]) {
    // Αρχικοποίηση καταγραφής για το endpoint
    requestCounts[endpoint] = {
      count: 0,
      resetTime: Date.now() + getResetPeriod(endpoint),
      isRateLimited: false
    };
  }

  // Τρέχουσα ώρα
  const now = Date.now();
  
  // Αν έχει περάσει η ώρα επαναφοράς, επαναφέρουμε το μετρητή
  if (now > requestCounts[endpoint].resetTime) {
    requestCounts[endpoint] = {
      count: 0,
      resetTime: now + getResetPeriod(endpoint),
      isRateLimited: false
    };
  }
  
  // Αν είχε γίνει rate limit, επιστρέφουμε ότι ακόμη είναι rate limited
  if (requestCounts[endpoint].isRateLimited) {
    return true;
  }
  
  // Αύξηση του μετρητή αιτημάτων
  requestCounts[endpoint].count++;
  
  // Έλεγχος αν έχουμε φτάσει το όριο
  const isLimited = requestCounts[endpoint].count > getLimit(endpoint);
  
  if (isLimited) {
    console.warn(`Rate limit reached for ${endpoint}, cooling down...`);
    requestCounts[endpoint].isRateLimited = true;
  }
  
  return isLimited;
}

// Βοηθητική συνάρτηση για την απόκτηση του ορίου αιτημάτων
function getLimit(endpoint: string): number {
  // Έλεγχος για συγκεκριμένα endpoints
  for (const [key, config] of Object.entries(RATE_LIMITS)) {
    if (endpoint.includes(key)) {
      return config.limit;
    }
  }
  
  // Εάν δεν βρεθεί, χρησιμοποιούμε το προεπιλεγμένο όριο
  return RATE_LIMITS.default.limit;
}

// Βοηθητική συνάρτηση για την απόκτηση της περιόδου επαναφοράς
function getResetPeriod(endpoint: string): number {
  // Έλεγχος για συγκεκριμένα endpoints
  for (const [key, config] of Object.entries(RATE_LIMITS)) {
    if (endpoint.includes(key)) {
      return config.resetPeriod;
    }
  }
  
  // Εάν δεν βρεθεί, χρησιμοποιούμε την προεπιλεγμένη περίοδο
  return RATE_LIMITS.default.resetPeriod;
}

// Έλεγχος αν ένα σφάλμα είναι σφάλμα rate limit
export function isRateLimitError(error: any): boolean {
  if (!error) return false;
  
  // Έλεγχος για κοινούς κωδικούς και μηνύματα rate limit
  // Σημείωση: Τα ακριβή patterns εξαρτώνται από το API που χρησιμοποιείται
  
  // Έλεγχος κωδικού σφάλματος HTTP (συνήθως 429)
  if (error.status === 429 || error.statusCode === 429) {
    return true;
  }
  
  // Έλεγχος μηνύματος σφάλματος
  if (error.message && typeof error.message === 'string') {
    const rateLimitKeywords = [
      'rate limit', 'ratelimit', 'too many requests', '429', 
      'throttle', 'capacity', 'quota', 'limit exceeded'
    ];
    
    const lowerCaseMessage = error.message.toLowerCase();
    
    return rateLimitKeywords.some(keyword => lowerCaseMessage.includes(keyword));
  }
  
  // Έλεγχος για ειδικά σφάλματα από RPC
  if (error.data && typeof error.data === 'object') {
    const data = error.data;
    
    // Έλεγχος για σφάλματα RPC που σχετίζονται με rate limit
    if (data.code === -32005 || (data.message && data.message.includes('limit'))) {
      return true;
    }
  }
  
  return false;
}

// Εκτέλεση συνάρτησης με αυτόματη επανάληψη σε περίπτωση rate limit
export async function withRateLimitRetry<T>(
  fn: () => Promise<T>, 
  options: { endpoint: string; maxRetries?: number; retryDelay?: number } = { endpoint: 'default' }
): Promise<T> {
  const { endpoint, maxRetries = 3, retryDelay = 2000 } = options;
  
  let attempts = 0;
  
  while (attempts <= maxRetries) {
    try {
      // Έλεγχος για rate limit πριν την προσπάθεια
      if (isRateLimited(endpoint)) {
        // Εάν έχουμε φτάσει το max retries, θα εμφανίσουμε ένα toast και θα αποτύχουμε
        if (attempts === maxRetries) {
          toast.error('Πολλά αιτήματα', {
            description: 'Παρακαλώ δοκιμάστε ξανά αργότερα',
            id: `rate-limit-${endpoint}`
          });
          
          throw new Error(`Rate limit reached for ${endpoint} after ${attempts} attempts`);
        }
        
        // Αναμονή πριν την επόμενη προσπάθεια
        console.log(`Rate limited for ${endpoint}, retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        attempts++;
        continue;
      }
      
      // Εκτέλεση της συνάρτησης
      return await fn();
    } catch (error) {
      // Αν είναι σφάλμα rate limit, θα προσπαθήσουμε ξανά
      if (isRateLimitError(error)) {
        if (attempts === maxRetries) {
          console.error(`Rate limit retries exhausted for ${endpoint}`);
          throw error;
        }
        
        // Αυξημένο delay για κάθε προσπάθεια
        const currentRetryDelay = retryDelay * Math.pow(2, attempts);
        console.warn(`Rate limit error for ${endpoint}, retrying in ${currentRetryDelay}ms...`);
        
        // Αναμονή πριν την επόμενη προσπάθεια
        await new Promise(resolve => setTimeout(resolve, currentRetryDelay));
        attempts++;
      } else {
        // Για άλλα σφάλματα, απλά τα προωθούμε
        throw error;
      }
    }
  }
  
  // Εάν φτάσουμε εδώ, κάτι πήγε λάθος με τη λογική του loop
  throw new Error(`Unexpected state in rate limit retry for ${endpoint}`);
}
