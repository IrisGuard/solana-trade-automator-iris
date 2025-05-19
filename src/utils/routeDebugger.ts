
/**
 * Route Debugger
 * A utility for diagnosing issues with routing in the application
 */

// Expose globally for direct console access
(window as any).routeDebugger = {
  checkRoutes: () => {
    try {
      console.log('[RouteDebugger] Running route diagnostics...');
      
      // Check current route
      console.log('[RouteDebugger] Current path:', window.location.pathname);
      
      // Check if the path matches any known route
      const knownRoutes = [
        '/',
        '/dashboard',
        '/wallet',
        '/portfolio',
        '/transactions',
        '/tokens',
        '/test-api',
        '/bot-control',
        '/bots',
        '/api-vault',
        '/help'
      ];
      
      const isKnownRoute = knownRoutes.includes(window.location.pathname);
      console.log('[RouteDebugger] Is known route:', isKnownRoute);
      
      // Check root element
      const rootElement = document.getElementById('root');
      console.log('[RouteDebugger] Root element present:', !!rootElement);
      
      // Check router outlet
      const mainContent = document.getElementById('main-content');
      console.log('[RouteDebugger] Main content element present:', !!mainContent);
      
      // Check layout
      const layoutMounted = document.getElementById('layout-mounted');
      console.log('[RouteDebugger] Layout mounted:', !!layoutMounted);
      
      // Check for error boundary
      const errorBoundary = document.getElementById('error-boundary-triggered');
      console.log('[RouteDebugger] Error boundary triggered:', !!errorBoundary);
      
      // Return summary
      return {
        currentPath: window.location.pathname,
        isKnownRoute,
        rootElement: !!rootElement,
        mainContent: !!mainContent,
        layoutMounted: !!layoutMounted,
        errorBoundary: !!errorBoundary
      };
    } catch (err) {
      console.error('[RouteDebugger] Error running diagnostics:', err);
      return { error: err };
    }
  },
  
  navigateTo: (path) => {
    try {
      console.log(`[RouteDebugger] Manually navigating to: ${path}`);
      window.location.href = path;
      return true;
    } catch (err) {
      console.error('[RouteDebugger] Navigation failed:', err);
      return false;
    }
  },
  
  refreshPage: () => {
    console.log('[RouteDebugger] Refreshing page...');
    window.location.reload();
  }
};

/**
 * Initialize route debugging
 */
export function initRouteDebugging() {
  console.log('[RouteDebugger] Initializing route debugging tools');
  
  // Listen for route changes
  const originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(this, arguments as any);
    console.log(`[RouteDebugger] Route changed to: ${location.pathname}`);
  };
  
  // Add manual refresh button to special key combo
  document.addEventListener('keydown', (e) => {
    // Alt+Shift+D to debug routes
    if (e.altKey && e.shiftKey && e.key === 'd') {
      e.preventDefault();
      console.log('[RouteDebugger] Running route diagnostics...');
      (window as any).routeDebugger.checkRoutes();
    }
    
    // Alt+Shift+R to refresh
    if (e.altKey && e.shiftKey && e.key === 'r') {
      e.preventDefault();
      console.log('[RouteDebugger] Manual refresh triggered');
      window.location.reload();
    }
  });
  
  return (window as any).routeDebugger;
}

// Auto-initialize
export const routeDebugger = initRouteDebugging();
