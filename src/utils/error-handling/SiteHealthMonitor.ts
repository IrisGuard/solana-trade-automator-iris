
/**
 * Site Health Monitor
 * Monitors the health of key application components
 */

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  components: {
    [key: string]: {
      status: 'ok' | 'warning' | 'error';
      details?: string;
    }
  };
  timestamp: string;
}

// Track initialization
let isMonitoring = false;

export const SiteHealthMonitor = {
  start: () => {
    if (isMonitoring) {
      console.log('SiteHealthMonitor: Already monitoring');
      return;
    }
    
    if (typeof window === 'undefined') {
      console.log('SiteHealthMonitor: Cannot start in SSR environment');
      return;
    }
    
    console.log('SiteHealthMonitor: Starting health monitoring');
    isMonitoring = true;
    
    // Initialize health data
    window.siteHealth = {
      ...(window.siteHealth || {}),
      
      // Check health of various components
      check: (): HealthStatus => {
        console.log('SiteHealthMonitor: Performing health check');
        
        // Component checks
        const reactStatus = checkReactHealth();
        const routerStatus = checkRouterHealth();
        const domStatus = checkDOMHealth();
        
        // Determine overall status
        const hasErrors = [reactStatus, routerStatus, domStatus].some(s => s.status === 'error');
        const hasWarnings = [reactStatus, routerStatus, domStatus].some(s => s.status === 'warning');
        
        let overallStatus: HealthStatus['status'] = 'healthy';
        if (hasErrors) overallStatus = 'critical';
        else if (hasWarnings) overallStatus = 'degraded';
        
        const status: HealthStatus = {
          status: overallStatus,
          components: {
            react: reactStatus,
            router: routerStatus,
            dom: domStatus
          },
          timestamp: new Date().toISOString()
        };
        
        // Save last status
        window.siteHealth.lastCheck = status;
        
        return status;
      },
      
      // Get the last check result
      getLastCheck: (): HealthStatus | undefined => {
        return window.siteHealth?.lastCheck;
      },
      
      // Force a full repair
      repair: () => {
        console.log('SiteHealthMonitor: Initiating repair');
        try {
          // Re-apply React patches
          const { ensureReactCompatibility } = require('../reactPatches');
          ensureReactCompatibility();
          
          // Re-apply router patches
          const { ensureRouterCompatibility } = require('../routerPatches');
          ensureRouterCompatibility();
          
          return { 
            success: true, 
            message: 'Repair completed successfully'
          };
        } catch (error) {
          console.error('SiteHealthMonitor: Repair failed', error);
          return { 
            success: false, 
            message: `Repair failed: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    };
    
    // Run initial health check
    window.siteHealth.check();
    
    // Set up periodic checks
    const checkInterval = setInterval(() => {
      if (!document.hidden) { // Only run when tab is visible
        window.siteHealth.check();
      }
    }, 60000); // Check every minute
    
    // Cleanup function (for completeness)
    return () => {
      clearInterval(checkInterval);
      isMonitoring = false;
    };
  }
};

// Helper functions for health checks
function checkReactHealth() {
  try {
    // Check if React is available
    if (!window.React) {
      return { status: 'error', details: 'React not available on window' };
    }
    
    // Check JSX runtime
    if (!window.React.jsx || !window.React.jsxs) {
      return { status: 'error', details: 'JSX runtime incomplete' };
    }
    
    // Check development JSX runtime
    if (!window.React.jsxDEV && process.env.NODE_ENV === 'development') {
      return { status: 'warning', details: 'JSX development runtime missing' };
    }
    
    return { status: 'ok' };
  } catch (error) {
    return { 
      status: 'error', 
      details: `Error checking React: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

function checkRouterHealth() {
  try {
    // Check if React Router is available
    if (!window.patchedReactRouter) {
      return { status: 'warning', details: 'Router patches not applied' };
    }
    
    return { status: 'ok' };
  } catch (error) {
    return { 
      status: 'error', 
      details: `Error checking Router: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

function checkDOMHealth() {
  try {
    // Check if we can access basic DOM elements
    if (!document || !document.getElementById('root')) {
      return { status: 'error', details: 'DOM or root element not accessible' };
    }
    
    return { status: 'ok' };
  } catch (error) {
    return { 
      status: 'error', 
      details: `Error checking DOM: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

export default SiteHealthMonitor;
