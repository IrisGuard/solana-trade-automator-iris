
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';

interface EndpointStatus {
  url: string;
  name: string;
  isWorking: boolean;
  lastChecked: Date;
  responseTime?: number;
}

class HeliusEndpointMonitor {
  private endpoints: { id: string; name: string; url: string; }[] = [];
  private endpointStatus: Map<string, EndpointStatus> = new Map();
  private checkInterval: number = 5 * 60 * 1000; // 5 minutes
  private intervalId?: NodeJS.Timer;
  private isInitialized = false;

  constructor() {
    // Initialize when constructed
    this.initialize();
  }
  
  async initialize() {
    if (!this.isInitialized) {
      await this.loadEndpoints();
      this.startMonitoring();
      this.isInitialized = true;
    }
  }
  
  async loadEndpoints() {
    try {
      const { data, error } = await supabase
        .from('api_endpoints')
        .select('id, name, url')
        .eq('category', 'helius')
        .eq('is_active', true);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        this.endpoints = data;
        console.log(`Loaded ${data.length} Helius endpoints`);
      } else {
        console.warn("No Helius endpoints found");
        this.endpoints = [];
      }
    } catch (error) {
      console.error("Error loading Helius endpoints:", error);
      errorCollector.captureError(error, {
        component: 'HeliusEndpointMonitor',
        method: 'loadEndpoints'
      });
      this.endpoints = [];
    }
  }
  
  async checkEndpoint(endpoint: { id: string; name: string; url: string; }): Promise<EndpointStatus> {
    const start = Date.now();
    let isWorking = false;
    let responseTime = 0;
    
    try {
      // Replace {API_KEY} placeholder with a demo key for testing
      const url = endpoint.url.replace('{API_KEY}', 'demo-key');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      responseTime = Date.now() - start;
      isWorking = response.ok;
      
    } catch (error) {
      console.warn(`Endpoint check failed for ${endpoint.name}: ${error.message}`);
      isWorking = false;
    }
    
    const status: EndpointStatus = {
      url: endpoint.url,
      name: endpoint.name,
      isWorking,
      lastChecked: new Date(),
      responseTime
    };
    
    this.endpointStatus.set(endpoint.id, status);
    return status;
  }
  
  async checkAllEndpoints() {
    if (this.endpoints.length === 0) {
      await this.loadEndpoints();
    }
    
    for (const endpoint of this.endpoints) {
      await this.checkEndpoint(endpoint);
    }
    
    // Log summary of endpoint status
    const workingCount = Array.from(this.endpointStatus.values())
      .filter(status => status.isWorking)
      .length;
    
    console.log(`Helius endpoints status: ${workingCount}/${this.endpoints.length} working`);
    return this.getEndpointStatuses();
  }
  
  startMonitoring() {
    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Start new monitoring interval
    this.intervalId = setInterval(() => {
      this.checkAllEndpoints();
    }, this.checkInterval);
    
    // Run initial check
    this.checkAllEndpoints();
  }
  
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  getEndpointStatuses() {
    return Array.from(this.endpointStatus.values());
  }
  
  async forceReload() {
    this.isInitialized = false;
    await this.loadEndpoints();
    this.startMonitoring();
    this.isInitialized = true;
  }
}

// Export singleton instance
export const heliusEndpointMonitor = new HeliusEndpointMonitor();
