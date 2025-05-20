
/**
 * Monitor the health of the application
 */
import { toast } from 'sonner';

interface HealthCheckResult {
  healthy: boolean;
  criticalIssuesFound: boolean;
  issues: string[];
}

export class SiteHealthMonitor {
  private static isRunning: boolean = false;
  private static healthCheckInterval: number | null = null;
  
  /**
   * Start the health monitoring
   */
  public static start(): void {
    if (this.isRunning) {
      return;
    }
    
    this.isRunning = true;
    console.log("[Health] Starting site health monitoring");
    
    // Run initial check
    this.checkHealth();
    
    // Set up periodic checks
    this.healthCheckInterval = window.setInterval(() => {
      this.checkHealth();
    }, 5 * 60 * 1000); // Every 5 minutes
  }
  
  /**
   * Stop the health monitoring
   */
  public static stop(): void {
    if (!this.isRunning) {
      return;
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    this.isRunning = false;
    console.log("[Health] Stopped site health monitoring");
  }
  
  /**
   * Check the health of the site
   * This performs various checks to ensure the application is working properly
   */
  public static checkHealth(): HealthCheckResult {
    console.log("[Health] Running site health check");
    
    const issues: string[] = [];
    let criticalIssues = false;
    
    // Check for local storage access
    try {
      localStorage.setItem("health_check", "ok");
      localStorage.removeItem("health_check");
    } catch (e) {
      issues.push("localStorage unavailable");
      criticalIssues = true;
    }
    
    // Check for important DOM elements
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      issues.push("Root element missing");
      criticalIssues = true;
    }
    
    // Check if error collector is available
    if (typeof window.errorCollector === 'undefined') {
      issues.push("Error collector unavailable");
    }
    
    // Check error count
    const errorCount = window.errorCollector?.getErrorCount?.() || 0;
    if (errorCount > 10) {
      issues.push(`High error count (${errorCount})`);
      criticalIssues = errorCount > 20;
    }
    
    const result = {
      healthy: issues.length === 0,
      criticalIssuesFound: criticalIssues,
      issues
    };
    
    if (!result.healthy && criticalIssues) {
      toast.error("Εντοπίστηκαν κρίσιμα προβλήματα", {
        description: `${issues[0]}${issues.length > 1 ? ' και άλλα...' : ''}`,
        duration: 0
      });
    }
    
    return result;
  }
}
