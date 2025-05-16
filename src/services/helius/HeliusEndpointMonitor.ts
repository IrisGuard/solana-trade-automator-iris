
import { supabase } from "@/integrations/supabase/client";
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';

/**
 * Διεπαφή για τα endpoints του Helius API
 */
interface HeliusEndpoint {
  id: string;
  name: string;
  url: string;
  type: 'rpc' | 'api' | 'transactions';
  is_active: boolean;
  last_check?: string;
  response_time?: number;
  error_count: number;
  success_count: number;
}

/**
 * Κλάση για την παρακολούθηση και διαχείριση των endpoints του Helius API
 */
class HeliusEndpointMonitor {
  private endpoints: HeliusEndpoint[] = [];
  private initialized = false;
  
  /**
   * Προεπιλεγμένα endpoints για το Helius API
   */
  private defaultEndpoints: Array<Omit<HeliusEndpoint, 'id'>> = [
    {
      name: "Helius RPC Mainnet",
      url: "https://mainnet.helius-rpc.com/?api-key={api-key}",
      type: 'rpc',
      is_active: true,
      error_count: 0,
      success_count: 0
    },
    {
      name: "Helius API v0",
      url: "https://api.helius.xyz/v0?api-key={api-key}",
      type: 'api',
      is_active: true,
      error_count: 0,
      success_count: 0
    },
    {
      name: "Helius Transactions API",
      url: "https://api.helius.xyz/v0/transactions?api-key={api-key}",
      type: 'transactions',
      is_active: true,
      error_count: 0,
      success_count: 0
    }
  ];
  
  /**
   * Αρχικοποίηση του συστήματος παρακολούθησης
   */
  public async initialize(): Promise<void> {
    try {
      // Αν έχει ήδη αρχικοποιηθεί, δεν χρειάζεται να το κάνουμε ξανά
      if (this.initialized && this.endpoints.length > 0) return;
      
      // Έλεγχος αν υπάρχουν endpoints στο Supabase
      const { data: endpointData, error } = await supabase
        .from('api_endpoints')
        .select('*')
        .eq('category', 'helius');
        
      if (error) {
        console.error('Error loading Helius API endpoints:', error);
        // Χρήση των προεπιλεγμένων endpoints αν υπάρχει σφάλμα
        await this.initializeDefaultEndpoints();
      } else if (endpointData && endpointData.length > 0) {
        // Μετατροπή δεδομένων από το σχήμα του πίνακα api_endpoints στο σχήμα που χρησιμοποιεί η κλάση
        this.endpoints = endpointData.map(item => ({
          id: item.id,
          name: item.name,
          url: item.url,
          type: this.getEndpointType(item.url),
          is_active: item.is_active,
          error_count: 0,
          success_count: 0
        }));
        
        console.log(`Loaded ${this.endpoints.length} Helius API endpoints`);
      } else {
        // Αν δεν υπάρχουν καταχωρήσεις, χρησιμοποιούμε τα προεπιλεγμένα
        console.log('No Helius API endpoints found, using defaults');
        await this.initializeDefaultEndpoints();
      }
      
      this.initialized = true;
    } catch (err) {
      console.error('Error initializing HeliusEndpointMonitor:', err);
      errorCollector.captureError(err instanceof Error ? err : new Error('Error initializing HeliusEndpointMonitor'), {
        component: 'HeliusEndpointMonitor',
        source: 'client'
      });
      
      // Χρήση των προεπιλεγμένων endpoints αν συμβεί οποιοδήποτε σφάλμα
      this.endpoints = this.defaultEndpoints.map((endpoint, index) => ({
        ...endpoint,
        id: `default-${index}`
      }));
      
      this.initialized = true;
    }
  }
  
  /**
   * Αρχικοποίηση των προεπιλεγμένων endpoints
   */
  private async initializeDefaultEndpoints(): Promise<void> {
    try {
      // Προσπάθεια εισαγωγής των προεπιλεγμένων endpoints στο Supabase
      for (const endpoint of this.defaultEndpoints) {
        const { error } = await supabase
          .from('api_endpoints')
          .insert({
            name: endpoint.name,
            url: endpoint.url,
            category: 'helius',
            is_active: endpoint.is_active,
            is_public: true
          });
          
        if (error) {
          console.error('Error adding default endpoint to Supabase:', error);
        }
      }
      
      // Φόρτωση από το Supabase
      const { data } = await supabase
        .from('api_endpoints')
        .select('*')
        .eq('category', 'helius');
        
      if (data && data.length > 0) {
        this.endpoints = data.map(item => ({
          id: item.id,
          name: item.name,
          url: item.url,
          type: this.getEndpointType(item.url),
          is_active: item.is_active,
          error_count: 0,
          success_count: 0
        }));
      } else {
        // Αν αποτύχει η εισαγωγή, χρησιμοποιούμε τα προεπιλεγμένα endpoints αλλά μόνο στη μνήμη
        this.endpoints = this.defaultEndpoints.map((endpoint, index) => ({
          ...endpoint,
          id: `default-${index}`
        }));
      }
    } catch (err) {
      console.error('Error initializing default endpoints:', err);
      
      // Χρησιμοποίηση των προεπιλεγμένων endpoints στη μνήμη
      this.endpoints = this.defaultEndpoints.map((endpoint, index) => ({
        ...endpoint,
        id: `default-${index}`
      }));
    }
  }
  
  /**
   * Προσδιορισμός του τύπου του endpoint από το URL
   */
  private getEndpointType(url: string): 'rpc' | 'api' | 'transactions' {
    if (url.includes('transactions')) {
      return 'transactions';
    } else if (url.includes('-rpc.com')) {
      return 'rpc';
    } else {
      return 'api';
    }
  }
  
  /**
   * Επιστρέφει το καλύτερο διαθέσιμο endpoint για τον συγκεκριμένο τύπο
   */
  public getBestEndpoint(type: 'rpc' | 'api' | 'transactions'): HeliusEndpoint | null {
    if (!this.initialized) {
      console.warn('HeliusEndpointMonitor not initialized');
      return null;
    }
    
    // Φιλτράρισμα endpoints βάσει τύπου και ενεργής κατάστασης
    const availableEndpoints = this.endpoints
      .filter(ep => ep.type === type && ep.is_active)
      .sort((a, b) => {
        // Προτεραιότητα με βάση τον λόγο επιτυχίας/αποτυχίας
        const aSuccessRatio = a.success_count / (a.error_count + 1);
        const bSuccessRatio = b.success_count / (b.error_count + 1);
        return bSuccessRatio - aSuccessRatio;
      });
      
    return availableEndpoints.length > 0 ? availableEndpoints[0] : null;
  }
  
  /**
   * Σημείωση επιτυχημένης κλήσης για ένα endpoint
   */
  public markEndpointSuccess(endpointUrl: string, responseTime?: number): void {
    if (!this.initialized) return;
    
    const endpoint = this.endpoints.find(ep => ep.url === endpointUrl);
    if (endpoint) {
      endpoint.success_count++;
      if (responseTime) endpoint.response_time = responseTime;
      endpoint.last_check = new Date().toISOString();
      
      // Ενημέρωση του Supabase (ασύγχρονα)
      this.updateEndpointStatus(endpoint.id, {
        success_count: endpoint.success_count,
        response_time: endpoint.response_time,
        last_check: endpoint.last_check
      });
    }
  }
  
  /**
   * Σημείωση αποτυχημένης κλήσης για ένα endpoint
   */
  public markEndpointError(endpointUrl: string): void {
    if (!this.initialized) return;
    
    const endpoint = this.endpoints.find(ep => ep.url === endpointUrl);
    if (endpoint) {
      endpoint.error_count++;
      endpoint.last_check = new Date().toISOString();
      
      // Απενεργοποίηση endpoint αν έχει πολλά σφάλματα
      if (endpoint.error_count > 5 && endpoint.success_count < 2) {
        endpoint.is_active = false;
        console.warn(`Deactivating endpoint due to high error count: ${endpoint.name}`);
      }
      
      // Ενημέρωση του Supabase (ασύγχρονα)
      this.updateEndpointStatus(endpoint.id, {
        error_count: endpoint.error_count,
        is_active: endpoint.is_active,
        last_check: endpoint.last_check
      });
    }
  }
  
  /**
   * Ενημέρωση της κατάστασης του endpoint στο Supabase
   */
  private async updateEndpointStatus(id: string, updates: any): Promise<void> {
    if (id.startsWith('default-')) return; // Δεν ενημερώνουμε τα προεπιλεγμένα endpoints που είναι μόνο στη μνήμη
    
    try {
      await supabase
        .from('api_endpoints')
        .update(updates)
        .eq('id', id);
    } catch (err) {
      console.error('Error updating endpoint status:', err);
    }
  }
  
  /**
   * Έλεγχος αν η υπηρεσία είναι λειτουργική
   */
  public isServiceOperational(): boolean {
    if (!this.initialized || this.endpoints.length === 0) return false;
    
    // Έλεγχος αν υπάρχει τουλάχιστον ένα ενεργό endpoint για κάθε τύπο
    const hasActiveRpc = this.endpoints.some(ep => ep.type === 'rpc' && ep.is_active);
    const hasActiveApi = this.endpoints.some(ep => ep.type === 'api' && ep.is_active);
    
    return hasActiveRpc || hasActiveApi;
  }
  
  /**
   * Επιστρέφει το συνολικό αριθμό των endpoints
   */
  public getEndpointCount(): number {
    return this.endpoints.length;
  }
  
  /**
   * Επιστρέφει τον αριθμό των ενεργών endpoints
   */
  public getActiveEndpointCount(): number {
    return this.endpoints.filter(ep => ep.is_active).length;
  }
  
  /**
   * Ανανέωση των δεδομένων από το Supabase
   */
  public async forceReload(): Promise<void> {
    this.initialized = false;
    await this.initialize();
  }
}

// Singleton instance
export const heliusEndpointMonitor = new HeliusEndpointMonitor();
