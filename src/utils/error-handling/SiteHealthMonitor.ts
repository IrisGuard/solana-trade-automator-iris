
import { errorCollector } from './collector';

interface HealthCheckResult {
  issues: string[];
  criticalIssuesFound: boolean;
  lastChecked: Date;
}

export const SiteHealthMonitor = {
  // Start monitoring
  start(): void {
    console.log('Site health monitoring started');
    // Perform initial health check
    this.checkHealth();
  },

  checkHealth(): HealthCheckResult {
    const issues: string[] = [];
    let criticalIssuesFound = false;
    
    try {
      window.localStorage.setItem('healthCheck', 'test');
      window.localStorage.removeItem('healthCheck');
    } catch (e) {
      issues.push('Cannot access localStorage');
      criticalIssuesFound = true;
    }
    
    if (!window.indexedDB) {
      issues.push('IndexedDB not supported');
    }
    
    if (!navigator.onLine) {
      issues.push('No internet connection');
      criticalIssuesFound = true;
    }
    
    const recentErrors = errorCollector.getRecentErrors();
    if (recentErrors.length > 5) {
      issues.push(`Found ${recentErrors.length} recent errors`);
      if (recentErrors.length > 10) {
        criticalIssuesFound = true;
      }
    }
    
    return {
      issues,
      criticalIssuesFound,
      lastChecked: new Date()
    };
  },
  
  getMemoryUsage(): number | null {
    if (window.performance && (window.performance as any).memory) {
      const memory = (window.performance as any).memory;
      return Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100);
    }
    return null;
  }
};
