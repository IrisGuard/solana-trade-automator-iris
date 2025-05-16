// Απλό πρότυπο του HeliusEndpointMonitor.ts για να διορθώσω τα σφάλματα clearInterval

import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';

class HeliusEndpointMonitor {
  private intervalId: any = null;
  private checkIntervalId: any = null;
  private endpoints: any[] = [];
  private isInitialized = false;

  constructor() {
    // Αρχικοποίηση
  }

  // Μέθοδος για ανανέωση των endpoints
  public async refreshEndpoints(): Promise<boolean> {
    try {
      // Get API endpoints from Supabase - using api_endpoints table
      const { data, error } = await supabase
        .from('api_endpoints')
        .select('*')
        .eq('category', 'helius')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching Helius API endpoints:', error);
        errorCollector.captureError(error, {
          component: 'HeliusEndpointMonitor',
          method: 'refreshEndpoints',
          additional: 'Fallback to existing endpoints'
        });
        return false;
      }
      
      // Extract endpoints from result
      if (data && data.length > 0) {
        this.endpoints = data;
        this.isInitialized = true;
        return true;
      }
      
      this.isInitialized = true;
      return false;
    } catch (error) {
      console.error('Exception refreshing Helius API endpoints:', error);
      errorCollector.captureError(error, {
        component: 'HeliusEndpointMonitor',
        method: 'refreshEndpoints',
        additional: 'Unexpected exception'
      });
      return false;
    }
  }

  // Διόρθωση των μεθόδων που χρησιμοποιούν clearInterval
  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
  }

  // Αναγκαστική επαναφόρτωση των endpoints
  public async forceReload(): Promise<void> {
    this.stopMonitoring();
    this.isInitialized = false;
    await this.refreshEndpoints();
  }

  // Initialize for first use
  public async initialize(): Promise<void> {
    this.isInitialized = false;
    await this.refreshEndpoints();
    console.log("HeliusEndpointMonitor initialized");
  }
}

// Εξαγωγή του singleton instance
export const heliusEndpointMonitor = new HeliusEndpointMonitor();
