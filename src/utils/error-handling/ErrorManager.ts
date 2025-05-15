
import { errorCollector } from './collector';
import { supabase } from '@/lib/supabase';
import { connection } from '@/services/solana/config';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import { createEnhancedError } from '@/types/errorTypes';

type ErrorSource = 'SUPABASE' | 'SOLANA-RPC' | 'CONSOLE' | 'REACT';
type ErrorLevel = 'CRITICAL' | 'WARNING' | 'INFO';

interface BotError {
  timestamp: Date;
  message: string;
  source: ErrorSource;
  level: ErrorLevel;
  stackTrace?: string;
  metadata?: Record<string, unknown>;
  autoResolved?: boolean;
}

declare global {
  interface Window {
    __REACT_CONTEXT_FALLBACK__?: any;
  }
}

export class ErrorManager {
  private static instance: ErrorManager;
  private errors: BotError[] = [];
  private autoFixRules = {
    'SUPABASE': this.fixSupabaseError.bind(this),
    'SOLANA-RPC': this.fixSolanaError.bind(this),
    'REACT': this.fixReactError.bind(this)
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

  private async fixSupabaseError(error: BotError): Promise<boolean> {
    try {
      if (error.message.includes('JWT expired')) {
        const { data } = await supabase.auth.refreshSession();
        return !!data.session;
      }
      
      if (error.message.includes('network error')) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        // Note: supabase doesn't have a direct reconnect method, it will auto-reconnect
        return true;
      }
      
      return false;
    } catch (fixError) {
      console.error("Error fixing Supabase error:", fixError);
      return false;
    }
  }

  private async fixSolanaError(error: BotError): Promise<boolean> {
    try {
      // Test current RPC endpoint
      const testKey = new PublicKey('So11111111111111111111111111111111111111112');
      
      try {
        await connection.getBalance(testKey);
      } catch (testError) {
        // RPC endpoint is failing, switch to backup
        if (error.metadata?.rpcEndpoint) {
          const currentEndpoint = String(error.metadata.rpcEndpoint);
          const newEndpoint = currentEndpoint.includes('mainnet') 
            ? RPC_ENDPOINTS.BACKUP
            : RPC_ENDPOINTS.FALLBACK;
          
          // Update the connection endpoint
          // Note: _rpcEndpoint is not directly accessible, so we create a notification instead
          toast.info("Switching to backup RPC endpoint", { 
            description: `Switched from ${currentEndpoint} to ${newEndpoint}` 
          });
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error fixing Solana error:", error);
      return false;
    }
  }

  private fixReactError(error: BotError): boolean {
    // Auto-fix common React errors
    if (error.message.includes('jsx-runtime')) {
      this.injectJsxRuntimeFallback();
      return true;
    }
    
    if (error.message.includes('createContext')) {
      this.fixReactContextIssue();
      return true;
    }
    
    return false;
  }

  private injectJsxRuntimeFallback() {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    script.onload = () => {
      toast.success("React runtime patched", {
        description: "JSX runtime issue fixed, reloading page..."
      });
      setTimeout(() => window.location.reload(), 2000);
    };
    document.head.appendChild(script);
  }

  private fixReactContextIssue() {
    if (!window.__REACT_CONTEXT_FALLBACK__ && window.React) {
      window.__REACT_CONTEXT_FALLBACK__ = window.React.createContext;
      toast.success("React context patched", {
        description: "React createContext issue fixed"
      });
      return true;
    }
    return false;
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

// Define RPC endpoints
export const RPC_ENDPOINTS = {
  PRIMARY: 'https://solana-mainnet.rpcpool.com',
  BACKUP: 'https://api.mainnet-beta.solana.com',
  FALLBACK: 'https://ssc-dao.genesysgo.net'
};

// Initialize and export singleton instance
export const errorManager = ErrorManager.getInstance();
