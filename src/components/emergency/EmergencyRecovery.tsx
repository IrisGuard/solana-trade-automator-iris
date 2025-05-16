
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { SiteBackupService } from '@/utils/site-protection/SiteBackupService';
import { SiteHealthMonitor } from '@/utils/error-handling/SiteHealthMonitor';
import { toast } from 'sonner';

export function EmergencyRecovery() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  
  // Check for conditions that should trigger recovery button visibility
  useEffect(() => {
    // Check if there's a hash parameter or localStorage flag to force display
    const shouldForceShow = window.location.hash === '#emergency-recovery' || 
                           localStorage.getItem('emergency_recovery_show') === 'true';
    
    // Check for error count in collector
    const errorCount = window.errorCollector?.getErrorCount?.() || 0;
    const hasManyErrors = errorCount > 5;
    
    // Check for critical site issues
    const healthCheck = SiteHealthMonitor.checkHealth();
    const hasCriticalIssues = healthCheck.criticalIssuesFound;
    
    // Set visibility based on conditions
    setIsVisible(shouldForceShow || hasManyErrors || hasCriticalIssues);
    
    // Set up a listener for special key combination to show recovery
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Shift + R key combination
      if (e.altKey && e.shiftKey && e.key === 'R') {
        setIsVisible(true);
        localStorage.setItem('emergency_recovery_show', 'true');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Handle create backup
  const handleCreateBackup = () => {
    SiteBackupService.createBackup();
  };
  
  // Handle restore from backup
  const handleRestoreBackup = () => {
    setIsRecovering(true);
    setRecoveryAttempts(prev => prev + 1);
    
    setTimeout(() => {
      const success = SiteBackupService.restoreFromBackup();
      setIsRecovering(false);
      
      if (!success && recoveryAttempts >= 2) {
        toast.error("Αποτυχία επαναφοράς", {
          description: "Προσπαθήστε να καθαρίσετε την προσωρινή μνήμη του περιηγητή σας και να ανανεώσετε τη σελίδα",
          duration: 0
        });
      }
    }, 1500);
  };
  
  // Handle force health check
  const handleHealthCheck = () => {
    const result = SiteHealthMonitor.checkHealth();
    
    if (result.healthy) {
      toast.success("Η ιστοσελίδα λειτουργεί κανονικά", {
        description: "Δεν εντοπίστηκαν σφάλματα στη δομή της εφαρμογής"
      });
    } else {
      toast.error("Εντοπίστηκαν προβλήματα", {
        description: `${result.issues.length} προβλήματα: ${result.issues[0]}${result.issues.length > 1 ? '...' : ''}`,
        action: {
          label: "Επαναφορά",
          onClick: handleRestoreBackup
        },
        duration: 0
      });
    }
  };
  
  // If not visible, render nothing or a hidden element
  if (!isVisible) {
    return (
      <div id="emergency-recovery-hidden" className="hidden" aria-hidden="true">
        {/* Hidden but available in DOM for emergency access */}
      </div>
    );
  }
  
  return (
    <div 
      id="emergency-recovery" 
      className={`fixed bottom-4 right-4 z-50 bg-destructive/90 backdrop-blur-sm p-3 rounded-lg 
                 shadow-lg border border-destructive-foreground/40 text-destructive-foreground
                 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="font-semibold">Εργαλείο Επαναφοράς</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 rounded-full"
          onClick={() => {
            setIsVisible(false);
            localStorage.removeItem('emergency_recovery_show');
          }}
        >
          <span className="sr-only">Close</span>
          <span aria-hidden="true">×</span>
        </Button>
      </div>
      
      <div className="text-xs mb-3 text-destructive-foreground/80">
        Χρησιμοποιήστε αυτό το εργαλείο σε περίπτωση προβλημάτων με την εφαρμογή.
      </div>
      
      <div className="flex flex-col gap-2">
        <Button 
          variant="outline"
          size="sm"
          className="bg-background/20 border-background/20 hover:bg-background/30 text-destructive-foreground w-full justify-start gap-2"
          onClick={handleHealthCheck}
        >
          <ShieldCheck className="h-4 w-4" />
          Έλεγχος Λειτουργίας
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-background/20 border-background/20 hover:bg-background/30 text-destructive-foreground w-full justify-start gap-2"
          onClick={handleCreateBackup}
        >
          <ShieldCheck className="h-4 w-4" />
          Δημιουργία Αντιγράφου
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-background/20 border-background/20 hover:bg-background/30 text-destructive-foreground w-full justify-start gap-2"
          onClick={handleRestoreBackup}
          disabled={isRecovering}
        >
          {isRecovering ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Επαναφορά...
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4" />
              Επαναφορά από Αντίγραφο
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
