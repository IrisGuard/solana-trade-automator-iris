
import { supabase } from "@/integrations/supabase/client";
import { displayError } from "@/utils/error-handling/displayError";
import { heliusKeyManager } from "./HeliusKeyManager";

/**
 * Διεπαφή για αντικείμενο endpoint
 */
interface EndpointStatus {
  url: string;
  name: string;
  isActive: boolean;
  lastCheck: Date;
  responseTime: number;
  category: string;
}

/**
 * Κλάση για την παρακολούθηση και έλεγχο των Helius endpoints
 */
export class HeliusEndpointMonitor {
  private endpoints: EndpointStatus[] = [];
  private initialized = false;
  private lastCheck: Date | null = null;
  private readonly CHECK_INTERVAL = 10 * 60 * 1000; // 10 λεπτά

  /**
   * Αρχικοποίηση του monitor με endpoints από το Supabase
   */
  public async initialize(): Promise<void> {
    try {
      // Αν έχει γίνει ήδη αρχικοποίηση και έχει περάσει λιγότερο από το διάστημα ελέγχου
      const now = new Date();
      if (this.initialized && this.lastCheck && 
          (now.getTime() - this.lastCheck.getTime()) < this.CHECK_INTERVAL) {
        return;
      }

      // Λήψη των endpoints από το Supabase
      const { data, error } = await supabase
        .from('api_endpoints')
        .select('*')
        .eq('category', 'helius')
        .eq('is_active', true);

      if (error) {
        displayError(`Error loading Helius endpoints: ${error.message}`, { component: 'HeliusEndpointMonitor' });
      } else if (data && data.length > 0) {
        // Μετατροπή των δεδομένων σε EndpointStatus
        this.endpoints = data.map(item => ({
          url: item.url,
          name: item.name,
          isActive: true,
          lastCheck: new Date(),
          responseTime: 0,
          category: item.category
        }));
        
        console.log(`Loaded ${this.endpoints.length} Helius endpoints`);
        
        // Έλεγχος των endpoints
        await this.checkAllEndpoints();
      } else {
        console.log('No Helius endpoints found');
        this.addDefaultEndpoints();
      }

      this.initialized = true;
      this.lastCheck = now;
    } catch (err) {
      displayError('Error initializing HeliusEndpointMonitor', { 
        component: 'HeliusEndpointMonitor',
        details: err
      });
    }
  }

  /**
   * Προσθήκη προεπιλεγμένων endpoints αν δεν υπάρχουν στη βάση
   */
  private addDefaultEndpoints(): void {
    const apiKey = heliusKeyManager.getCurrentKey();
    
    this.endpoints = [
      {
        url: `https://mainnet.helius-rpc.com/?api-key=${apiKey}`,
        name: 'Helius Mainnet RPC',
        isActive: true,
        lastCheck: new Date(),
        responseTime: 0,
        category: 'helius'
      },
      {
        url: `https://api.helius.xyz/v0/?api-key=${apiKey}`,
        name: 'Helius API v0',
        isActive: true,
        lastCheck: new Date(),
        responseTime: 0,
        category: 'helius'
      }
    ];
  }

  /**
   * Έλεγχος όλων των endpoints
   */
  public async checkAllEndpoints(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    for (const endpoint of this.endpoints) {
      await this.checkEndpoint(endpoint);
    }

    // Ενημέρωση του χρόνου τελευταίου ελέγχου
    this.lastCheck = new Date();
  }

  /**
   * Έλεγχος συγκεκριμένου endpoint
   */
  private async checkEndpoint(endpoint: EndpointStatus): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(endpoint.url, {
        method: 'HEAD', // Χρήση HEAD για γρήγορο έλεγχο
        signal: AbortSignal.timeout(5000) // 5 δευτερόλεπτα timeout
      });
      
      // Υπολογισμός του χρόνου απόκρισης
      endpoint.responseTime = Date.now() - startTime;
      endpoint.lastCheck = new Date();
      endpoint.isActive = response.ok;
      
      return response.ok;
    } catch (err) {
      console.error(`Error checking endpoint ${endpoint.name}:`, err);
      endpoint.isActive = false;
      endpoint.lastCheck = new Date();
      endpoint.responseTime = Date.now() - startTime;
      return false;
    }
  }

  /**
   * Επιστρέφει το καλύτερο endpoint για συγκεκριμένο τύπο
   */
  public getBestEndpoint(type: 'rpc' | 'api' | 'transactions'): EndpointStatus | null {
    if (!this.initialized || this.endpoints.length === 0) {
      return null;
    }

    // Φιλτράρισμα των ενεργών endpoints που ταιριάζουν με τον τύπο
    const matchingEndpoints = this.endpoints.filter(e => {
      const url = e.url.toLowerCase();
      switch (type) {
        case 'rpc': return e.isActive && url.includes('rpc');
        case 'api': return e.isActive && url.includes('v0') && !url.includes('transactions');
        case 'transactions': return e.isActive && url.includes('transactions');
        default: return e.isActive;
      }
    });

    if (matchingEndpoints.length === 0) {
      return null;
    }

    // Ταξινόμηση με βάση τον χρόνο απόκρισης (αύξουσα)
    matchingEndpoints.sort((a, b) => a.responseTime - b.responseTime);
    
    return matchingEndpoints[0];
  }

  /**
   * Επιστρέφει τον αριθμό των ενεργών endpoints
   */
  public getActiveEndpointCount(): number {
    return this.endpoints.filter(e => e.isActive).length;
  }

  /**
   * Επιστρέφει τον συνολικό αριθμό των διαθέσιμων endpoints
   */
  public getEndpointCount(): number {
    return this.endpoints.length;
  }

  /**
   * Επιστρέφει αν η υπηρεσία είναι συνολικά λειτουργική
   * (τουλάχιστον 1 ενεργό endpoint και 1 λειτουργικό κλειδί)
   */
  public isServiceOperational(): boolean {
    return this.getActiveEndpointCount() > 0 && heliusKeyManager.getWorkingKeyCount() > 0;
  }

  /**
   * Επιστρέφει όλα τα endpoints
   */
  public getAllEndpoints(): EndpointStatus[] {
    return [...this.endpoints];
  }

  /**
   * Αναγκαστική επαναφόρτωση των endpoints από το Supabase
   */
  public async forceReload(): Promise<void> {
    this.initialized = false;
    await this.initialize();
  }
}

// Singleton instance
export const heliusEndpointMonitor = new HeliusEndpointMonitor();

// Αυτόματη αρχικοποίηση κατά την εισαγωγή
heliusEndpointMonitor.initialize().catch(err => {
  displayError('Failed to initialize HeliusEndpointMonitor', {
    component: 'HeliusEndpointMonitor',
    details: err
  });
});
