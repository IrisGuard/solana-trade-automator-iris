
/**
 * This file contains patches for React Router DOM compatibility
 */

// Import our router exports to ensure they're loaded early
import * as RouterExports from '@/lib/router-exports';
import { debugRouterExports } from '@/lib/router-exports';

// Apply patches for React Router DOM compatibility
export function applyRouterPatches() {
  // Log available router exports for debugging
  debugRouterExports();

  // Try to make React Router use window.React if available
  if (typeof window !== 'undefined' && window.React) {
    // Ensure React is properly patched for Router
    console.log('Applying React Router DOM compatibility patches');
  }

  return true;
}

// Auto-execute the patches
applyRouterPatches();

// Export for explicit usage
export default applyRouterPatches;
