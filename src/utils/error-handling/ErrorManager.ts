
import { supabase } from '@/lib/supabase';
import { connection } from '@/services/solana/config';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import { BotError, ErrorSource, ErrorLevel, RPC_ENDPOINTS } from './errorTypes';
import { fixSupabaseError, fixSolanaError, fixReactError } from './autoFixers';
import { createEnhancedError } from '@/types/errorTypes';
import { errorCollector } from './collector';

declare global {
  interface Window {
    __REACT_CONTEXT_FALLBACK__?: any;
  }
}

export class ErrorManager {
  private static instance: ErrorManager;
  private errors: BotError[] = [];
  private autoFixRules = {
    'SUPABASE': fixSupabaseError,
    'SOLANA-RPC': fixSolanaError,
    'REACT': fixReactError
  };

  private constructor() {
    this.setupGlobalHandlers();
  }

  public static getInstance(): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  private setupGlobalHandlers() {
    // Catch All Uncaught Errors
    window.onerror = (message, source, lineno, colno, error) => {
      this.handleError({
        message: error?.message || String(message),
        source: 'CONSOLE',
        level: 'CRITICAL',
        stackTrace: error?.stack
      });
    };

    // Catch All Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: event.reason?.message || 'Unhandled promise rejection',
        source: 'CONSOLE',
        level: 'CRITICAL',
        stackTrace: event.reason?.stack
      });
    });

    // Listen to Supabase Errors
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') this.handleError({
        message: 'User signed out unexpectedly',
        source: 'SUPABASE',
        level: 'WARNING'
      });
    });

    // Since connection.on is not available, we'll use a different approach
    // We'll monitor RPC connection issues through error handling in requests
    // This is a safer approach than trying to attach to an event that doesn't exist
    console.info('Solana RPC connection monitoring initialized');
  }

  public handleError(error: Omit<BotError, 'timestamp'>) {
    const timestamp = new Date();
    const fullError: BotError = { ...error, timestamp };
    
    // Attempt Auto-Fix First
    let autoResolved = false;
    if (this.autoFixRules[error.source]) {
      autoResolved = this.autoFixRules[error.source](fullError);
      fullError.autoResolved = autoResolved;
    }

    // Store Error
    this.errors.push(fullError);
    
    // Add to error collector for internal tracking
    const enhancedError = createEnhancedError(fullError.message, {
      source: fullError.source,
      level: fullError.level,
      stackTrace: fullError.stackTrace,
      metadata: fullError.metadata,
      autoResolved: fullError.autoResolved
    });

    errorCollector.captureError(enhancedError, {
      component: 'ErrorManager',
      source: fullError.source,
      severity: fullError.level === 'CRITICAL' ? 'high' : 
               fullError.level === 'WARNING' ? 'medium' : 'low'
    });

    // Sync with Supabase every 10 errors
    if (this.errors.length % 10 === 0) {
      this.syncWithSupabase();
    }

    // Critical Errors Notification
    if (fullError.level === 'CRITICAL' && !fullError.autoResolved) {
      this.alertDevTeam(fullError);
    }

    return fullError.autoResolved;
  }

  private async syncWithSupabase() {
    try {
      const errorsToSync = this.errors.filter(e => !e.autoResolved);
      
      if (errorsToSync.length === 0) return;
      
      const { error } = await supabase
        .from('bot_errors')
        .insert(errorsToSync.map(e => ({
          message: e.message,
          source: e.source,
          level: e.level,
          stack_trace: e.stackTrace,
          metadata: e.metadata,
          created_at: e.timestamp.toISOString()
        })));

      if (!error) {
        this.errors = this.errors.filter(e => e.autoResolved);
      } else {
        console.error("Failed to sync errors with Supabase:", error);
      }
    } catch (error) {
      console.error("Error syncing with Supabase:", error);
    }
  }

  private alertDevTeam(error: BotError) {
    // Display critical error in UI
    toast.error("Critical Error", {
      description: error.message,
      duration: 10000
    });
    
    // Log to console for debugging
    console.error('CRITICAL ERROR:', error);
    
    // Additional alerting logic would go here (e.g., webhook call)
  }

  public getRecentErrors(): BotError[] {
    return [...this.errors];
  }
}

// Initialize and export singleton instance
export const errorManager = ErrorManager.getInstance();
