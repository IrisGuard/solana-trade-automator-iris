
import { errorCollector } from "./collector";

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  lastCheck: Date;
  checks: {
    js: boolean;
    network: boolean;
    storage: boolean;
    rendering: boolean;
  };
  errors: {
    count: number;
    lastError?: Date;
  };
}

class HealthMonitor {
  private status: HealthStatus;
  private checkInterval: number | null = null;
  private listeners: Array<(status: HealthStatus) => void> = [];
  
  constructor() {
    this.status = {
      status: 'healthy',
      lastCheck: new Date(),
      checks: {
        js: true,
        network: true,
        storage: true,
        rendering: true,
      },
      errors: {
        count: 0,
        lastError: undefined
      }
    };
  }
  
  public start(intervalMs = 60000) {
    this.runChecks();
    
    if (this.checkInterval === null) {
      this.checkInterval = window.setInterval(() => this.runChecks(), intervalMs);
      console.log(`[HealthMonitor] Started monitoring with ${intervalMs}ms interval`);
    }
    
    return this;
  }
  
  public stop() {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('[HealthMonitor] Stopped monitoring');
    }
    
    return this;
  }
  
  public getStatus(): HealthStatus {
    return { ...this.status };
  }
  
  public subscribe(callback: (status: HealthStatus) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
  
  private runChecks() {
    const previousStatus = this.status.status;
    
    // Update last check time
    this.status.lastCheck = new Date();
    
    // Check for JS errors
    const errorCount = errorCollector.getErrorCount();
    this.status.errors.count = errorCount;
    
    if (errorCount > 0) {
      this.status.errors.lastError = new Date();
    }
    
    // Check local storage
    let storageWorks = true;
    try {
      localStorage.setItem('health_check', 'ok');
      if (localStorage.getItem('health_check') !== 'ok') {
        storageWorks = false;
      }
      localStorage.removeItem('health_check');
    } catch (e) {
      storageWorks = false;
      console.error('[HealthMonitor] Local storage check failed', e);
    }
    
    this.status.checks.storage = storageWorks;
    
    // Determine overall status
    if (errorCount > 10 || !storageWorks) {
      this.status.status = 'critical';
    } else if (errorCount > 3) {
      this.status.status = 'degraded';
    } else {
      this.status.status = 'healthy';
    }
    
    // Notify listeners if status changed
    if (previousStatus !== this.status.status) {
      this.notifyListeners();
    }
    
    return this.status;
  }
  
  private notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getStatus());
      } catch (error) {
        console.error('[HealthMonitor] Error in listener callback', error);
      }
    });
  }
}

// Singleton instance
export const SiteHealthMonitor = new HealthMonitor();
