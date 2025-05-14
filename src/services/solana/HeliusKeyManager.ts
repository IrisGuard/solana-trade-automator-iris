
import { supabase } from "@/integrations/supabase/client";
import { errorCollector } from "@/utils/error-handling/collector";

/**
 * Διαχειριστής για τα API κλειδιά του Helius
 * Αναλαμβάνει την εναλλαγή και διαχείριση των κλειδιών για αποφυγή rate limits
 */
class HeliusKeyManager {
  private keys: string[] = [];
  private currentKeyIndex = 0;
  private initialized = false;
  private defaultKey = 'ddb32813-1f4b-459d-8964-310b1b73a053'; // Demo key

  /**
   * Αρχικοποίηση του διαχειριστή με κλειδιά από το Supabase
   */
  public async initialize(): Promise<void> {
    try {
      // Αν έχει ήδη αρχικοποιηθεί, δεν χρειάζεται να το κάνουμε ξανά
      if (this.initialized && this.keys.length > 0) return;

      // Λήψη των κλειδιών από το Supabase
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('key_value')
        .eq('service', 'helius')
        .eq('status', 'active');

      if (error) {
        console.error('Error loading Helius API keys:', error);
        // Αν υπάρχει σφάλμα, χρησιμοποιούμε το προεπιλεγμένο κλειδί
        this.keys = [this.defaultKey];
      } else if (data && data.length > 0) {
        // Αποθήκευση των κλειδιών που βρέθηκαν
        this.keys = data.map(item => item.key_value);
        console.log(`Loaded ${this.keys.length} Helius API keys`);
      } else {
        // Αν δεν βρέθηκαν κλειδιά, χρησιμοποιούμε το προεπιλεγμένο κλειδί
        console.log('No Helius API keys found, using default demo key');
        this.keys = [this.defaultKey];
      }

      this.initialized = true;
    } catch (err) {
      console.error('Error initializing HeliusKeyManager:', err);
      errorCollector.captureError(err instanceof Error ? err : new Error('Error initializing HeliusKeyManager'), {
        component: 'HeliusKeyManager',
        source: 'client'
      });
      
      // Σε περίπτωση σφάλματος, χρησιμοποιούμε το προεπιλεγμένο κλειδί
      this.keys = [this.defaultKey];
      this.initialized = true;
    }
  }

  /**
   * Επιστρέφει το τρέχον ενεργό κλειδί
   */
  public getCurrentKey(): string {
    // Αν δεν έχουμε κανένα κλειδί ή δεν έχει αρχικοποιηθεί, επιστρέφουμε το προεπιλεγμένο
    if (!this.initialized || this.keys.length === 0) {
      return this.defaultKey;
    }

    return this.keys[this.currentKeyIndex];
  }

  /**
   * Εναλλάσσει στο επόμενο διαθέσιμο κλειδί και το επιστρέφει
   * Χρήσιμο για την αποφυγή rate limits
   */
  public rotateKey(): string {
    if (!this.initialized || this.keys.length <= 1) {
      return this.getCurrentKey();
    }

    // Κυκλική εναλλαγή των κλειδιών
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
    console.log(`Rotated to Helius API key ${this.currentKeyIndex + 1}/${this.keys.length}`);
    
    return this.getCurrentKey();
  }

  /**
   * Προσθέτει ένα νέο κλειδί στη λίστα
   */
  public addKey(key: string): void {
    if (!key || this.keys.includes(key)) return;
    
    this.keys.push(key);
    console.log(`Added new Helius API key, now using ${this.keys.length} keys`);
  }

  /**
   * Επιστρέφει τον αριθμό των διαθέσιμων κλειδιών
   */
  public getKeyCount(): number {
    return this.keys.length;
  }
}

// Singleton instance
export const heliusKeyManager = new HeliusKeyManager();
