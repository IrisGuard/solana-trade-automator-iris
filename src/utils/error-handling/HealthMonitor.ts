
interface HealthStatus {
  isHealthy: boolean;
  issues: string[];
  lastCheck: Date;
}

export class HealthMonitor {
  private lastHealthCheck: HealthStatus | null = null;
  
  checkHealth(): HealthStatus {
    const issues: string[] = [];
    let isHealthy = true;
    
    // Check localStorage
    try {
      localStorage.setItem('health_test', 'test');
      localStorage.removeItem('health_test');
    } catch {
      issues.push('localStorage unavailable');
      isHealthy = false;
    }
    
    // Check network
    if (!navigator.onLine) {
      issues.push('No network connection');
      isHealthy = false;
    }
    
    const status = {
      isHealthy,
      issues,
      lastCheck: new Date()
    };
    
    this.lastHealthCheck = status;
    return status;
  }
  
  getLastHealthCheck(): HealthStatus | null {
    return this.lastHealthCheck;
  }
}

export const healthMonitor = new HealthMonitor();
