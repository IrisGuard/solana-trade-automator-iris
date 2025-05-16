
import { toast } from "sonner";
import { errorCollector } from "./error-handling/collector";
import { SiteBackupService } from "./site-protection/SiteBackupService";
import { SiteHealthMonitor } from "./error-handling/SiteHealthMonitor";
import { AutoRecovery } from "./error-handling/AutoRecovery";

/**
 * Create a test error
 */
export function createTestError(message: string = "This is a test error") {
  const error = new Error(message);
  errorCollector.captureError(error, {
    component: "ErrorTestUtils",
    source: "test",
    severity: "medium"
  });
  return error;
}

/**
 * Simulate a critical error
 */
export function simulateCriticalError() {
  const error = new Error("Critical error: Cannot read properties of undefined");
  errorCollector.captureError(error, {
    component: "ErrorTestUtils",
    source: "test",
    severity: "critical"
  });
  
  toast.error("Κρίσιμο σφάλμα προσομοιώθηκε", {
    description: "Το σύστημα αυτόματης επαναφοράς θα πρέπει να ενεργοποιηθεί"
  });
  
  return error;
}

/**
 * Clear all errors from the collector
 */
export function clearAllErrors() {
  errorCollector.clearErrors();
  toast.success("Καθαρισμός σφαλμάτων", {
    description: "Όλα τα σφάλματα διαγράφηκαν από τον συλλέκτη"
  });
}

/**
 * Create a backup of the current site state
 */
export function createSiteBackup() {
  const success = SiteBackupService.createBackup();
  if (success) {
    toast.success("Δημιουργία αντιγράφου ασφαλείας", {
      description: "Επιτυχής αποθήκευση της τρέχουσας κατάστασης"
    });
  }
  return success;
}

/**
 * Restore the site from the last backup
 */
export function restoreSiteFromBackup() {
  return SiteBackupService.restoreFromBackup();
}

/**
 * Run a site health check
 */
export function checkSiteHealth() {
  const result = SiteHealthMonitor.checkHealth();
  
  if (result.healthy) {
    toast.success("Έλεγχος υγείας εφαρμογής", {
      description: "Η εφαρμογή λειτουργεί κανονικά"
    });
  } else {
    toast.error("Προβλήματα στην εφαρμογή", {
      description: `Βρέθηκαν ${result.issues.length} προβλήματα`
    });
  }
  
  return result;
}

/**
 * Initialize the protection system
 */
export function initProtectionSystem() {
  // Create initial backup
  SiteBackupService.createBackup({ silent: true });
  
  // Initialize auto recovery
  AutoRecovery.init();
  
  // Start health monitor
  SiteHealthMonitor.start();
  
  return {
    createBackup: createSiteBackup,
    restore: restoreSiteFromBackup,
    checkHealth: checkSiteHealth
  };
}
