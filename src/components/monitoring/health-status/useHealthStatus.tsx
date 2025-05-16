
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { SiteHealthMonitor } from '@/utils/error-handling/SiteHealthMonitor';
import { SiteBackupService } from '@/utils/site-protection/SiteBackupService';
import { HealthState } from './types';

export function useHealthStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [health, setHealth] = useState<HealthState>({
    status: 'healthy',
    lastChecked: new Date(),
    issues: [],
    backupCount: 0,
    maxBackups: 11, // Default value
  });
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const statusText = {
    healthy: "Υγιές",
    warning: "Προειδοποιήσεις",
    critical: "Κρίσιμα ζητήματα"
  };
  
  // Check health on mount and periodically
  useEffect(() => {
    checkSystemHealth();
    
    // Set up periodic health checks every 30 seconds
    const healthCheckInterval = setInterval(() => {
      checkSystemHealth(true);
    }, 30000);
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, []);
  
  // Check backup information
  useEffect(() => {
    getBackupInfo();
  }, []);

  const getBackupInfo = () => {
    try {
      // Get backup count using SiteBackupService methods
      const backupCount = SiteBackupService.countAvailableBackups();
      const maxBackups = SiteBackupService.getMaxBackups();
      
      // Get last backup time
      const primaryBackup = localStorage.getItem('site_structure_backup');
      let lastBackupTime = null;
      
      if (primaryBackup) {
        try {
          const backupData = JSON.parse(primaryBackup);
          if (backupData.timestamp) {
            lastBackupTime = new Date(backupData.timestamp);
          }
        } catch (e) {
          console.error("Error parsing backup timestamp:", e);
        }
      }
      
      setHealth(prev => ({
        ...prev,
        backupCount,
        maxBackups,
        lastBackupTime
      }));
      
    } catch (e) {
      console.error("Error getting backup info:", e);
    }
  };

  const checkSystemHealth = (silent = false) => {
    if (!silent) {
      setIsChecking(true);
    }
    
    try {
      // Use the SiteHealthMonitor to check health
      const healthCheck = SiteHealthMonitor.checkHealth();
      
      const newStatus: HealthState['status'] = healthCheck.criticalIssuesFound 
        ? 'critical' 
        : (healthCheck.issues.length > 0 ? 'warning' : 'healthy');
      
      setHealth(prev => ({
        ...prev,
        status: newStatus,
        lastChecked: new Date(),
        issues: healthCheck.issues
      }));
      
      // Refresh backup info after health check
      getBackupInfo();
      
      if (!silent) {
        toast.success("Ο έλεγχος υγείας ολοκληρώθηκε", {
          description: newStatus === 'healthy' 
            ? "Το σύστημα λειτουργεί κανονικά"
            : `Βρέθηκαν ${healthCheck.issues.length} ζητήματα`
        });
      }
    } catch (e) {
      console.error("Error checking system health:", e);
      if (!silent) {
        toast.error("Σφάλμα κατά τον έλεγχο υγείας", {
          description: "Δεν ήταν δυνατός ο έλεγχος της κατάστασης του συστήματος"
        });
      }
    } finally {
      if (!silent) {
        setIsChecking(false);
      }
    }
  };

  const createBackup = async () => {
    setIsCreatingBackup(true);
    
    try {
      const success = SiteBackupService.createBackup();
      
      if (success) {
        // Update backup information after creating a new backup
        getBackupInfo();
      }
    } catch (e) {
      console.error("Error creating backup:", e);
      toast.error("Σφάλμα αντιγράφου ασφαλείας", {
        description: "Δεν ήταν δυνατή η δημιουργία αντιγράφου ασφαλείας"
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const restoreBackup = () => {
    const confirm = window.confirm("Είστε βέβαιοι ότι θέλετε να επαναφέρετε το τελευταίο αντίγραφο ασφαλείας; Αυτή η ενέργεια θα επανεκκινήσει την εφαρμογή.");
    
    if (confirm) {
      try {
        SiteBackupService.restoreFromBackup();
      } catch (e) {
        console.error("Error restoring backup:", e);
        toast.error("Αποτυχία επαναφοράς", {
          description: "Δεν ήταν δυνατή η επαναφορά από το αντίγραφο ασφαλείας"
        });
      }
    }
  };

  return {
    isOpen,
    setIsOpen,
    health,
    isCreatingBackup,
    isChecking,
    statusText,
    checkSystemHealth,
    createBackup,
    restoreBackup
  };
}
