
import { Connection, ConnectionConfig } from '@solana/web3.js';
import { getBestRpcEndpoint, getAllRpcEndpoints } from './endpoints';
import { errorCollector } from '@/utils/error-handling/collector';

export class ConnectionManager {
  private static instance: ConnectionManager;
  private currentConnection: Connection | null = null;
  private currentEndpointIndex = 0;
  private availableEndpoints: string[] = [];
  
  private constructor() {
    this.availableEndpoints = getAllRpcEndpoints();
    this.initializeConnection();
  }
  
  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }
  
  private initializeConnection(): void {
    try {
      const endpoint = this.availableEndpoints[this.currentEndpointIndex] || getBestRpcEndpoint();
      
      const config: ConnectionConfig = {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
        disableRetryOnRateLimit: false,
      };
      
      this.currentConnection = new Connection(endpoint, config);
      console.log(`[ConnectionManager] Initialized with endpoint: ${endpoint}`);
    } catch (error) {
      console.error('[ConnectionManager] Failed to initialize connection:', error);
      errorCollector.captureError(error as Error, {
        component: 'ConnectionManager',
        source: 'initializeConnection'
      });
    }
  }
  
  getConnection(): Connection {
    if (!this.currentConnection) {
      this.initializeConnection();
    }
    return this.currentConnection!;
  }
  
  async switchToNextEndpoint(): Promise<boolean> {
    try {
      this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.availableEndpoints.length;
      this.initializeConnection();
      
      // Test the new connection
      await this.testConnection();
      return true;
    } catch (error) {
      console.error('[ConnectionManager] Failed to switch endpoint:', error);
      return false;
    }
  }
  
  private async testConnection(): Promise<boolean> {
    try {
      if (!this.currentConnection) return false;
      
      const slot = await this.currentConnection.getSlot();
      console.log(`[ConnectionManager] Connection test successful, current slot: ${slot}`);
      return true;
    } catch (error) {
      console.error('[ConnectionManager] Connection test failed:', error);
      throw error;
    }
  }
  
  async executeWithFallback<T>(
    operation: (connection: Connection) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const connection = this.getConnection();
        return await operation(connection);
      } catch (error) {
        lastError = error as Error;
        console.warn(`[ConnectionManager] Attempt ${attempt + 1} failed:`, error);
        
        // If it's a 403 or rate limit error, try next endpoint
        if (this.isRateLimitOrForbiddenError(error as Error)) {
          const switched = await this.switchToNextEndpoint();
          if (!switched && attempt === maxRetries - 1) {
            break;
          }
        } else if (attempt === maxRetries - 1) {
          break;
        }
      }
    }
    
    // Log the final error
    errorCollector.captureError(lastError!, {
      component: 'ConnectionManager',
      source: 'executeWithFallback',
      severity: 'high',
      details: { attempts: maxRetries }
    });
    
    throw lastError;
  }
  
  private isRateLimitOrForbiddenError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return message.includes('403') || 
           message.includes('rate limit') || 
           message.includes('too many requests') ||
           message.includes('access forbidden');
  }
}

// Export singleton instance
export const connectionManager = ConnectionManager.getInstance();
