
import { SiteHealthMonitor } from './error-handling/SiteHealthMonitor';
import { SiteBackupService } from './site-protection/SiteBackupService';
import { AutoRecovery } from './error-handling/AutoRecovery';

// Initialize the entire protection system
export function initProtectionSystem() {
  // Start the site health monitor
  SiteHealthMonitor.start();
  
  // Initialize auto-recovery system
  AutoRecovery.init();
  
  // Create initial backup if needed
  if (!localStorage.getItem('site_structure_backup')) {
    SiteBackupService.createBackup({ silent: true });
  }
  
  // Set up scheduled backups (every 2 hours)
  setInterval(() => {
    console.log('Creating scheduled backup...');
    SiteBackupService.createBackup({ silent: true });
  }, 2 * 60 * 60 * 1000);
  
  // Return object with health checking functionality
  return {
    checkHealth: SiteHealthMonitor.checkHealth,
    recover: SiteHealthMonitor.attemptRecovery,
    createBackup: SiteBackupService.createBackup,
    restoreBackup: SiteBackupService.restoreFromBackup
  };
}

// Simulate an error to test the error handling system
export function simulateError(type: string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
  switch (type) {
    case 'javascript':
      throw new Error('Simulated JavaScript error for testing purposes');
    
    case 'network':
      console.error('Simulated network error');
      return Promise.reject(new Error('Network request failed'));
    
    case 'api':
      console.error('Simulated API error');
      return Promise.reject({ status: 500, message: 'API Error' });
    
    case 'ui':
      document.getElementById('non-existing-element')!.innerHTML = 'This will fail';
      break;
      
    case 'storage':
      // Simulate storage corruption
      localStorage.setItem('_test_corrupted', '{invalid json:}');
      try {
        JSON.parse(localStorage.getItem('_test_corrupted')!);
      } catch (e) {
        throw new Error('Simulated storage corruption');
      }
      break;
      
    case 'async':
      setTimeout(() => {
        throw new Error('Simulated async error');
      }, 100);
      break;
      
    default:
      console.error('Unknown error type:', type);
  }
}

// Test the backup and recovery system
export function testBackupRecovery() {
  // Create a backup
  const backupCreated = SiteBackupService.createBackup();
  console.log('Backup created:', backupCreated);
  
  // Simulate some data changes
  localStorage.setItem('test_data', JSON.stringify({ timestamp: Date.now() }));
  
  // Restore from backup
  const restored = SiteBackupService.restoreFromBackup(false);
  console.log('Backup restored:', restored);
  
  return { backupCreated, restored };
}

// Added missing clearAllErrors function
export function clearAllErrors() {
  // Clear any error state from localStorage
  const errorKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('error_') || 
    key.includes('_error') || 
    key.includes('_errors')
  );
  
  // Remove each error-related item
  errorKeys.forEach(key => localStorage.removeItem(key));
  
  // Clear error collector if available
  try {
    const { errorCollector } = require('./error-handling/collector');
    if (errorCollector && typeof errorCollector.clearErrors === 'function') {
      errorCollector.clearErrors();
    }
  } catch (e) {
    console.warn('Error collector not available:', e);
  }
  
  console.log('All errors have been cleared');
  return true;
}

// Export utilities for console use
window.testUtils = {
  simulateError,
  testBackupRecovery,
  healthCheck: SiteHealthMonitor.checkHealth,
  createBackup: SiteBackupService.createBackup,
  restoreBackup: SiteBackupService.restoreFromBackup
};

// Add type definitions
declare global {
  interface Window {
    testUtils: {
      simulateError: (type: string, severity?: 'low' | 'medium' | 'high' | 'critical') => void;
      testBackupRecovery: () => { backupCreated: boolean; restored: boolean };
      healthCheck: () => any;
      createBackup: (options?: any) => boolean;
      restoreBackup: (showNotification?: boolean) => boolean;
    };
  }
}
