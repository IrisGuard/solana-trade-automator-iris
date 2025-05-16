
import { useState, useEffect, useMemo } from 'react';
import { errorCollector } from '@/utils/error-handling/collector';
import { errorManager } from '@/utils/error-handling/ErrorManager';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';

type ErrorSource = 'application' | 'network' | 'console' | 'database' | 'all';

export function useErrorDashboard() {
  const { t } = useTranslation();
  const [applicationErrors, setApplicationErrors] = useState<any[]>([]);
  const [networkErrors, setNetworkErrors] = useState<any[]>([]);
  const [consoleErrors, setConsoleErrors] = useState<any[]>([]);
  const [databaseErrors, setDatabaseErrors] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Total error count for badge display
  const totalErrors = useMemo(() => {
    return applicationErrors.length + networkErrors.length + consoleErrors.length + databaseErrors.length;
  }, [applicationErrors, networkErrors, consoleErrors, databaseErrors]);
  
  // Fetch errors from errorCollector
  useEffect(() => {
    try {
      // Get application errors
      const collectorErrors = errorCollector.getErrors().map((error) => ({
        ...error,
        errorType: 'application',
        timestamp: error.timestamp || new Date().toISOString()
      }));
      
      // Get system errors from errorManager
      const systemErrors = errorManager.getRecentErrors().map((error) => ({
        id: error.id,
        message: error.message,
        component: error.source,
        severity: error.level === 'CRITICAL' ? 'critical' : 
                 error.level === 'WARNING' ? 'medium' : 'low',
        timestamp: error.timestamp,
        errorType: 'application',
        autoResolved: error.autoResolved,
        stackTrace: error.stackTrace,
        // Add source property to fix the TypeScript error
        source: error.source
      }));
      
      // Combine and filter application errors
      setApplicationErrors([
        ...collectorErrors,
        ...systemErrors
      ].filter(err => {
        const source = (err.source || '').toLowerCase();
        return !['network', 'api', 'database'].includes(source);
      }));
      
      // Filter network errors
      setNetworkErrors(collectorErrors.filter(
        err => {
          const source = (err.source || '').toLowerCase();
          const message = (err.message || '').toLowerCase();
          return ['network', 'api'].includes(source) ||
                message.includes('network') ||
                message.includes('fetch') ||
                message.includes('api');
        }
      ));
      
      // Get console logs that are errors
      const savedLogs = JSON.parse(localStorage.getItem('app_console_logs') || '[]');
      setConsoleErrors(savedLogs.filter((log: any) => log.type === 'error').map((log: any) => ({
        id: `console_${log.timestamp}`,
        message: log.message,
        timestamp: log.timestamp,
        severity: 'medium',
        source: 'console',
        errorType: 'console'
      })));
      
      // Fetch database errors if authenticated
      fetchDatabaseErrors();
      
    } catch (error) {
      console.error('Error loading errors for dashboard:', error);
    }
  }, [refreshKey]);
  
  // Fetch database errors from Supabase
  const fetchDatabaseErrors = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) return;
      
      const { data: dbErrors, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      if (dbErrors) {
        setDatabaseErrors(dbErrors.map(err => ({
          id: err.id,
          message: err.error_message,
          stack: err.error_stack,
          component: err.component,
          source: err.source,
          timestamp: err.created_at,
          severity: 'high',
          errorType: 'database',
          resolved: err.resolved,
          url: err.url,
          browserInfo: err.browser_info
        })));
      }
    } catch (error) {
      console.error('Error fetching database errors:', error);
    }
  };
  
  // Refresh all errors
  const refreshErrors = () => {
    setRefreshKey(prev => prev + 1);
    toast.info(t('errors.refreshed'));
  };
  
  // Clear errors by type
  const clearErrors = (type: ErrorSource = 'all') => {
    if (type === 'application' || type === 'all') {
      errorCollector.clearErrors();
      setApplicationErrors([]);
    }
    
    if (type === 'console' || type === 'all') {
      localStorage.setItem('app_console_logs', '[]');
      setConsoleErrors([]);
    }
    
    if (type === 'network' || type === 'all') {
      setNetworkErrors([]);
    }
    
    if (type === 'database' || type === 'all') {
      // We don't clear database errors from DB, just from state
      setDatabaseErrors([]);
    }
    
    toast.success(t('errors.errorsCleared'));
  };
  
  // Mark error as resolved
  const resolveError = async (error: any) => {
    // Handle database errors differently - update in Supabase
    if (error.errorType === 'database') {
      try {
        const { error: updateError } = await supabase
          .from('error_logs')
          .update({ resolved: true })
          .eq('id', error.id);
          
        if (updateError) throw updateError;
        
        setDatabaseErrors(prev => 
          prev.map(err => err.id === error.id ? { ...err, resolved: true } : err)
        );
        
        toast.success(t('errors.errorResolved'));
      } catch (err) {
        console.error('Error resolving database error:', err);
        toast.error(t('errors.errorResolvingError'));
      }
    } else {
      // For other error types, just mark as resolved in state
      if (error.errorType === 'application') {
        setApplicationErrors(prev => 
          prev.map(err => err.id === error.id ? { ...err, resolved: true } : err)
        );
      } else if (error.errorType === 'network') {
        setNetworkErrors(prev => 
          prev.map(err => err.id === error.id ? { ...err, resolved: true } : err)
        );
      } else if (error.errorType === 'console') {
        setConsoleErrors(prev => 
          prev.map(err => err.id === error.id ? { ...err, resolved: true } : err)
        );
      }
      
      toast.success(t('errors.errorResolved'));
    }
  };
  
  return {
    applicationErrors,
    networkErrors,
    consoleErrors,
    databaseErrors,
    totalErrors,
    refreshErrors,
    clearErrors,
    resolveError
  };
}
