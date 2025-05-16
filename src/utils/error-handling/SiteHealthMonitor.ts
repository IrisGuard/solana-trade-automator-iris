
import { errorCollector } from './collector';
import { SiteBackupService } from '../site-protection/SiteBackupService';
import { toast } from 'sonner';

// Health check intervals
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute
const CRITICAL_ERROR_THRESHOLD = 3;

// Track consecutive errors
let consecutiveErrors = 0;
let lastHealthCheck = Date.now();
let monitoringActive = false;
let healthCheckIntervalId: number | null = null;

interface HealthCheckResult {
  healthy: boolean;
  issues: string[];
  criticalIssuesFound: boolean;
}

export class SiteHealthMonitor {
  // Start the health monitor
  public static start() {
    if (monitoringActive) {
      console.log("Site health monitoring already active");
      return;
    }
    
    // Create initial backup if none exists
    if (!localStorage.getItem('site_structure_backup')) {
      SiteBackupService.createBackup({ silent: true });
    }
    
    // Set up periodic health checks
    this.setupPeriodicChecks();
    
    // Monitor for critical errors
    this.setupErrorMonitoring();
    
    // Set flag
    monitoringActive = true;
    
    console.log("Site health monitoring active");
  }
  
  // Stop the health monitor
  public static stop() {
    if (healthCheckIntervalId !== null) {
      clearInterval(healthCheckIntervalId);
      healthCheckIntervalId = null;
    }
    
    monitoringActive = false;
    console.log("Site health monitoring stopped");
  }
  
  // Perform a complete health check
  public static checkHealth(): HealthCheckResult {
    const issues: string[] = [];
    let criticalIssuesFound = false;
    
    // Check for critical DOM elements - modified to check for only the root element
    // which is the one we actually need for the React application
    const criticalElements = [
      { id: 'root', critical: true },
      // Removed app-container and main-content which were causing false alerts
    ];
    
    for (const element of criticalElements) {
      if (!document.getElementById(element.id)) {
        issues.push(`Missing critical DOM element: ${element.id}`);
        if (element.critical) criticalIssuesFound = true;
      }
    }
    
    // Check error count
    const recentErrorsCount = errorCollector.getRecentErrors(10).length;
    if (recentErrorsCount > 5) {
      issues.push(`High number of errors detected: ${recentErrorsCount}`);
      criticalIssuesFound = true;
    }
    
    // Check route availability
    try {
      const routes = document.querySelectorAll('a[href]');
      if (routes.length === 0) {
        issues.push('No navigation routes found');
        criticalIssuesFound = true;
      }
    } catch (error) {
      issues.push('Failed to check navigation routes');
    }
    
    // Update last health check timestamp
    lastHealthCheck = Date.now();
    
    return {
      healthy: issues.length === 0,
      issues,
      criticalIssuesFound
    };
  }
  
  // Attempt recovery if needed
  public static attemptRecovery(force = false): boolean {
    const healthCheck = this.checkHealth();
    
    if (force || healthCheck.criticalIssuesFound) {
      console.warn("Critical issues detected, attempting recovery", healthCheck.issues);
      return SiteBackupService.restoreFromBackup();
    }
    
    return false;
  }
  
  // Private helper methods
  private static setupPeriodicChecks() {
    // Clear any existing interval
    if (healthCheckIntervalId !== null) {
      clearInterval(healthCheckIntervalId);
    }
    
    // Run periodic health checks
    healthCheckIntervalId = window.setInterval(() => {
      const healthCheck = this.checkHealth();
      
      if (!healthCheck.healthy) {
        console.warn("Site health issues detected:", healthCheck.issues);
        
        if (healthCheck.criticalIssuesFound) {
          consecutiveErrors++;
          
          if (consecutiveErrors >= CRITICAL_ERROR_THRESHOLD) {
            console.error("Critical error threshold reached, attempting recovery");
            this.showRecoveryPrompt();
            consecutiveErrors = 0; // Reset counter after recovery attempt
          }
        }
      } else {
        // Reset consecutive errors counter if health check passes
        consecutiveErrors = 0;
        
        // Create a new backup periodically when the site is healthy
        const hoursSinceLastBackup = (Date.now() - lastHealthCheck) / (1000 * 60 * 60);
        if (hoursSinceLastBackup >= 24) {
          SiteBackupService.createBackup({ silent: true });
        }
      }
    }, HEALTH_CHECK_INTERVAL);
  }
  
  private static setupErrorMonitoring() {
    // Override window.onerror to also count towards consecutive errors
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      // Call original handler
      if (originalOnError) {
        originalOnError.call(window, message, source, lineno, colno, error);
      }
      
      // Increment error counter
      consecutiveErrors++;
      
      // Check if critical threshold reached
      if (consecutiveErrors >= CRITICAL_ERROR_THRESHOLD) {
        this.showRecoveryPrompt();
        consecutiveErrors = 0; // Reset counter
      }
      
      return false;
    };
  }
  
  private static showRecoveryPrompt() {
    toast.error(
      "Εντοπίστηκαν κρίσιμα σφάλματα", 
      {
        description: "Η ιστοσελίδα αντιμετωπίζει προβλήματα. Θέλετε να γίνει επαναφορά;",
        action: {
          label: "Επαναφορά",
          onClick: () => SiteBackupService.restoreFromBackup()
        },
        duration: 0 // Toast stays until dismissed
      }
    );
  }
}

// Initialize global accessor
declare global {
  interface Window {
    siteHealth: {
      check: () => HealthCheckResult;
      recover: (force?: boolean) => boolean;
    };
  }
}

window.siteHealth = {
  check: SiteHealthMonitor.checkHealth.bind(SiteHealthMonitor),
  recover: SiteHealthMonitor.attemptRecovery.bind(SiteHealthMonitor)
};
