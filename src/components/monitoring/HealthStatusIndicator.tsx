
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, RefreshCw, Database, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { SiteHealthMonitor } from '@/utils/error-handling/SiteHealthMonitor';
import { SiteBackupService } from '@/utils/site-protection/SiteBackupService';

type HealthStatus = 'healthy' | 'warning' | 'critical';

interface HealthState {
  status: HealthStatus;
  lastChecked: Date;
  issues: string[];
  backupCount: number;
  lastBackupTime?: Date | null;
}

export function HealthStatusIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const [health, setHealth] = useState<HealthState>({
    status: 'healthy',
    lastChecked: new Date(),
    issues: [],
    backupCount: 0,
  });
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const statusColors = {
    healthy: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500"
  };

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
      // Get backup count from localStorage
      const backupKeys = ['site_structure_backup', 'site_structure_backup_1', 'site_structure_backup_2', 'site_structure_backup_3'];
      const backupCount = backupKeys.filter(key => localStorage.getItem(key)).length;
      
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
      
      const newStatus: HealthStatus = healthCheck.criticalIssuesFound 
        ? 'critical' 
        : (healthCheck.issues.length > 0 ? 'warning' : 'healthy');
      
      setHealth(prev => ({
        ...prev,
        status: newStatus,
        lastChecked: new Date(),
        issues: healthCheck.issues
      }));
      
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

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`relative rounded-full h-8 w-8 p-0 ${statusColors[health.status]} border-white/20 hover:${statusColors[health.status]}/80`}
            aria-label="Κατάσταση υγείας συστήματος"
          >
            <Shield className="h-4 w-4 text-white" />
            {health.status !== 'healthy' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <Badge 
                className={`${statusColors[health.status]} text-white font-medium mb-1`}
                variant="outline"
              >
                {statusText[health.status]}
              </Badge>
              <CardTitle className="text-lg">Κατάσταση Συστήματος</CardTitle>
              <CardDescription>
                Τελευταίος έλεγχος: {health.lastChecked.toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              {health.issues.length > 0 && (
                <Alert variant={health.status === 'critical' ? 'destructive' : 'warning'} className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium">Εντοπίστηκαν {health.issues.length} ζητήματα</p>
                    <ul className="mt-2 text-xs list-disc list-inside">
                      {health.issues.slice(0, 3).map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                      {health.issues.length > 3 && (
                        <li>...και {health.issues.length - 3} ακόμα</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h3 className="font-medium mb-1 text-sm">Αντίγραφα ασφαλείας</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>Διαθέσιμα: {health.backupCount}/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {health.lastBackupTime 
                        ? `${health.lastBackupTime.toLocaleTimeString()}`
                        : 'Δεν υπάρχει'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-0 pt-2 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => checkSystemHealth()}
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Έλεγχος...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Έλεγχος υγείας
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={createBackup}
                  disabled={isCreatingBackup}
                >
                  {isCreatingBackup ? (
                    <>
                      <Database className="h-4 w-4 mr-2 animate-pulse" />
                      Αποθήκευση...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Δημιουργία αντιγράφου
                    </>
                  )}
                </Button>
              </div>
              {health.status !== 'healthy' && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="w-full" 
                  onClick={restoreBackup}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Επαναφορά από αντίγραφο
                </Button>
              )}
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
