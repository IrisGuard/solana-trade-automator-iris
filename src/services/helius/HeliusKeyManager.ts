
import { supabase } from "@/integrations/supabase/client";
import { errorCollector } from "@/utils/error-handling/collector";
import { displayError } from "@/utils/error-handling/displayError";
import { toast } from "sonner";

/**
 * Διεπαφή για αντικείμενο κλειδιού API
 */
interface ApiKeyInfo {
  id: string;
  key: string;
  name: string;
  priority: number;
  isWorking: boolean;
  lastUsed: Date;
  failCount: number;
  service: string;
}

/**
 * Διαχειριστής για τα API κλειδιά του Helius
 * Αναλαμβάνει την εναλλαγή και διαχείριση των κλειδιών για αποφυγή rate limits
 */
class HeliusKeyManager {
  private keys: ApiKeyInfo[] = [];
  private currentKeyIndex = 0;
  private initialized = false;
  private defaultKey = 'ddb32813-1f4b-459d-8964-310b1b73a053'; // Demo key
  private lastCheck: Date | null = null;
  private readonly CHECK_INTERVAL = 5 * 60 * 1000; // 5 λεπτά
  private readonly MAX_FAIL_COUNT = 3; // Μέγιστος αριθμός αποτυχιών πριν το κλειδί τεθεί σε μη λειτουργική κατάσταση

  /**
   * Αρχικοποίηση του διαχειριστή με κλειδιά από το Supabase
   */
  public async initialize(): Promise<void> {
    try {
      // Αν έχει γίνει ήδη αρχικοποίηση και έχει περάσει λιγότερο από το διάστημα ελέγχου
      const now = new Date();
      if (this.initialized && this.keys.length > 0 && 
          this.lastCheck && 
          (now.getTime() - this.lastCheck.getTime()) < this.CHECK_INTERVAL) {
        return;
      }

      // Λήψη των κλειδιών από το Supabase
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('service', 'helius')
        .in('status', ['active', 'inactive']);

      if (error) {
        displayError(`Error loading Helius API keys: ${error.message}`, { component: 'HeliusKeyManager' });
        // Αν υπάρχει σφάλμα και δεν έχουμε κλειδιά, χρησιμοποιούμε το προεπιλεγμένο κλειδί
        if (this.keys.length === 0) {
          this.keys = [this.createDefaultKeyInfo()];
        }
      } else if (data && data.length > 0) {
        // Μετατροπή των δεδομένων σε ApiKeyInfo
        const newKeys: ApiKeyInfo[] = data.map((item, index) => ({
          id: item.id,
          key: item.key_value,
          name: item.name,
          priority: index,
          isWorking: item.status === 'active',
          lastUsed: new Date(item.updated_at),
          failCount: 0,
          service: item.service
        }));
        
        // Ταξινόμηση των κλειδιών με βάση την προτεραιότητα (active πρώτα)
        newKeys.sort((a, b) => {
          // Πρώτα τα λειτουργικά κλειδιά
          if (a.isWorking !== b.isWorking) {
            return a.isWorking ? -1 : 1;
          }
          // Μετά με βάση τον αριθμό αποτυχιών (αύξουσα)
          return a.failCount - b.failCount;
        });
        
        // Ενημέρωση των κλειδιών
        this.keys = newKeys;
        console.log(`Loaded ${this.keys.length} Helius API keys`);
      } else {
        // Αν δεν βρέθηκαν κλειδιά, χρησιμοποιούμε το προεπιλεγμένο κλειδί
        console.log('No Helius API keys found, using default demo key');
        this.keys = [this.createDefaultKeyInfo()];
      }

      this.initialized = true;
      this.lastCheck = now;
      this.currentKeyIndex = 0; // Επιστροφή στο πρώτο κλειδί μετά την αρχικοποίηση
    } catch (err) {
      displayError('Error initializing HeliusKeyManager', { 
        component: 'HeliusKeyManager',
        details: err
      });
      
      // Σε περίπτωση σφάλματος, χρησιμοποιούμε το προεπιλεγμένο κλειδί
      this.keys = [this.createDefaultKeyInfo()];
      this.initialized = true;
      this.lastCheck = new Date();
    }
  }

  /**
   * Δημιουργεί το προεπιλεγμένο αντικείμενο κλειδιού
   */
  private createDefaultKeyInfo(): ApiKeyInfo {
    return {
      id: 'default',
      key: this.defaultKey,
      name: 'Default Demo Key',
      priority: 999,
      isWorking: true,
      lastUsed: new Date(),
      failCount: 0,
      service: 'helius'
    };
  }

  /**
   * Επιστρέφει το τρέχον ενεργό κλειδί
   */
  public getCurrentKey(): string {
    // Αν δεν έχουμε κανένα κλειδί ή δεν έχει αρχικοποιηθεί, επιστρέφουμε το προεπιλεγμένο
    if (!this.initialized || this.keys.length === 0) {
      return this.defaultKey;
    }

    // Βεβαιωνόμαστε ότι το τρέχον index είναι έγκυρο
    if (this.currentKeyIndex >= this.keys.length) {
      this.currentKeyIndex = 0;
    }

    const key = this.keys[this.currentKeyIndex];
    key.lastUsed = new Date(); // Ενημέρωση της τελευταίας χρήσης
    
    return key.key;
  }

  /**
   * Εναλλάσσει στο επόμενο διαθέσιμο κλειδί και το επιστρέφει
   * Χρήσιμο για την αποφυγή rate limits
   */
  public rotateKey(): string {
    if (!this.initialized) {
      this.initialize().catch(console.error);
      return this.defaultKey;
    }

    if (this.keys.length <= 1) {
      return this.getCurrentKey();
    }

    // Αύξηση του μετρητή αποτυχιών για το τρέχον κλειδί
    this.keys[this.currentKeyIndex].failCount++;
    
    // Αν το κλειδί έχει υπερβεί το όριο αποτυχιών, το σημειώνουμε ως μη λειτουργικό
    if (this.keys[this.currentKeyIndex].failCount >= this.MAX_FAIL_COUNT) {
      this.keys[this.currentKeyIndex].isWorking = false;
      this.updateKeyStatusInSupabase(this.keys[this.currentKeyIndex].id, false)
        .catch(err => console.error('Error updating key status:', err));
    }

    // Κυκλική εναλλαγή των κλειδιών
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
    
    // Αν το επόμενο κλειδί δεν λειτουργεί, βρίσκουμε το επόμενο λειτουργικό
    let attempts = 0;
    while (!this.keys[this.currentKeyIndex].isWorking && attempts < this.keys.length) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
      attempts++;
    }
    
    // Αν όλα τα κλειδιά είναι μη λειτουργικά, επαναφέρουμε το πρώτο και επιχειρούμε ξανά
    if (attempts === this.keys.length) {
      this.currentKeyIndex = 0;
      this.keys[0].isWorking = true;
      this.keys[0].failCount = 0;
    }
    
    console.log(`Rotated to Helius API key ${this.currentKeyIndex + 1}/${this.keys.length}: ${this.keys[this.currentKeyIndex].name}`);
    return this.getCurrentKey();
  }

  /**
   * Ενημερώνει την κατάσταση ενός κλειδιού στο Supabase
   */
  private async updateKeyStatusInSupabase(keyId: string, isWorking: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('api_keys_storage')
        .update({ 
          status: isWorking ? 'active' : 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', keyId);
      
      if (error) {
        console.error('Error updating key status in Supabase:', error);
      }
    } catch (err) {
      console.error('Exception when updating key status:', err);
    }
  }

  /**
   * Σημειώνει ένα κλειδί ως επιτυχημένο (μειώνει τον μετρητή αποτυχιών)
   */
  public markKeyAsSuccessful(): void {
    if (!this.initialized || this.keys.length === 0) return;
    
    // Μείωση του μετρητή αποτυχιών και επισήμανση ως λειτουργικό
    const key = this.keys[this.currentKeyIndex];
    key.failCount = Math.max(0, key.failCount - 1);
    
    // Αν το κλειδί ήταν σημειωμένο ως μη λειτουργικό και τώρα λειτουργεί, ενημέρωση στο Supabase
    if (!key.isWorking) {
      key.isWorking = true;
      this.updateKeyStatusInSupabase(key.id, true)
        .catch(err => console.error('Error updating key status to active:', err));
    }
  }

  /**
   * Προσθέτει ένα νέο κλειδί στη λίστα
   */
  public addKey(key: string, name: string = "New Helius Key"): void {
    if (!key || this.keys.some(k => k.key === key)) return;
    
    this.keys.push({
      id: `temp-${Date.now()}`, // Προσωρινό ID μέχρι να αποθηκευτεί στο Supabase
      key,
      name,
      priority: this.keys.length,
      isWorking: true,
      lastUsed: new Date(),
      failCount: 0,
      service: 'helius'
    });
    console.log(`Added new Helius API key, now using ${this.keys.length} keys`);
  }

  /**
   * Ελέγχει αν ένα κλειδί είναι λειτουργικό
   */
  public async testKey(apiKey: string): Promise<boolean> {
    try {
      // Δημιουργία ενός endpoint για έλεγχο
      const endpoint = `https://api.helius.xyz/v0/?api-key=${apiKey}`;
      
      // Απλός έλεγχος για το αν το API ανταποκρίνεται
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 δευτερόλεπτα timeout
      });
      
      return response.ok;
    } catch (err) {
      console.error('Error testing Helius key:', err);
      return false;
    }
  }

  /**
   * Επιστρέφει τον αριθμό των λειτουργικών κλειδιών
   */
  public getWorkingKeyCount(): number {
    return this.keys.filter(k => k.isWorking).length;
  }

  /**
   * Επιστρέφει τον συνολικό αριθμό των διαθέσιμων κλειδιών
   */
  public getKeyCount(): number {
    return this.keys.length;
  }

  /**
   * Επιστρέφει λίστα με βασικές πληροφορίες για τα κλειδιά
   * Ασφαλής μέθοδος που δεν εκθέτει τα ίδια τα κλειδιά
   */
  public getKeysInfo(): Array<Omit<ApiKeyInfo, 'key'>> {
    return this.keys.map(({ key, ...info }) => info);
  }

  /**
   * Αναγκαστική επαναφόρτωση των κλειδιών από το Supabase
   */
  public async forceReload(): Promise<void> {
    this.initialized = false;
    await this.initialize();
  }
}

// Singleton instance
export const heliusKeyManager = new HeliusKeyManager();

// Αυτόματη αρχικοποίηση κατά την εισαγωγή
heliusKeyManager.initialize().catch(err => {
  displayError('Failed to initialize HeliusKeyManager', {
    component: 'HeliusKeyManager',
    details: err
  });
});
