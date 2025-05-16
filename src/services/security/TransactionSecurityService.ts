
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';

export interface TransactionSettings {
  id?: string;
  user_id: string;
  max_daily_amount: number;
  max_transaction_amount: number;
  whitelist_only: boolean;
  delay_seconds?: number;
  notification_email?: boolean;
  notification_app?: boolean;
}

export interface ApprovedAddress {
  id?: string;
  user_id: string;
  address: string;
  description?: string;
  blockchain: string;
}

export interface TransactionSecurityCheck {
  amount: number;
  toAddress: string;
  fromAddress: string;
  userId: string;
  tokenSymbol: string;
}

export interface TransactionValidationResult {
  allowed: boolean;
  reason?: string;
  delay?: number;
}

class TransactionSecurityService {
  private transactionLog: Map<string, { amount: number, timestamp: number }[]> = new Map();
  
  // Get user's security settings
  async getSettings(userId: string): Promise<TransactionSettings> {
    try {
      let { data, error } = await supabase
        .from('transaction_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') { // No records found
          // Create default settings
          const defaultSettings: Omit<TransactionSettings, 'id'> = {
            user_id: userId,
            max_daily_amount: 1000,
            max_transaction_amount: 500,
            whitelist_only: false,
            delay_seconds: 0,
            notification_email: true,
            notification_app: true
          };
          
          const { data: newSettings, error: insertError } = await supabase
            .from('transaction_settings')
            .insert([defaultSettings])
            .select('*')
            .single();
            
          if (insertError) throw insertError;
          return newSettings;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting transaction settings:', error);
      errorCollector.captureError(error, {
        component: 'TransactionSecurityService',
        method: 'getSettings',
      });
      
      // Return default settings on error
      return {
        user_id: userId,
        max_daily_amount: 1000,
        max_transaction_amount: 500,
        whitelist_only: false,
        delay_seconds: 0
      };
    }
  }
  
  // Get approved addresses for a user
  async getApprovedAddresses(userId: string): Promise<ApprovedAddress[]> {
    try {
      const { data, error } = await supabase
        .from('approved_addresses')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting approved addresses:', error);
      errorCollector.captureError(error, {
        component: 'TransactionSecurityService',
        method: 'getApprovedAddresses',
      });
      return [];
    }
  }
  
  // Add approved address
  async addApprovedAddress(address: Omit<ApprovedAddress, 'id'>): Promise<ApprovedAddress | null> {
    try {
      const { data, error } = await supabase
        .from('approved_addresses')
        .insert([address])
        .select('*')
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding approved address:', error);
      errorCollector.captureError(error, {
        component: 'TransactionSecurityService',
        method: 'addApprovedAddress',
      });
      return null;
    }
  }
  
  // Update transaction settings
  async updateSettings(userId: string, settings: Partial<TransactionSettings>): Promise<TransactionSettings | null> {
    try {
      const { data, error } = await supabase
        .from('transaction_settings')
        .update(settings)
        .eq('user_id', userId)
        .select('*')
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating transaction settings:', error);
      errorCollector.captureError(error, {
        component: 'TransactionSecurityService',
        method: 'updateSettings',
      });
      return null;
    }
  }
  
  // Track transaction for daily limits
  private trackTransaction(userId: string, amount: number): void {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    // Get or initialize user's transaction log
    let userTransactions = this.transactionLog.get(userId) || [];
    
    // Remove transactions older than 24 hours
    userTransactions = userTransactions.filter(tx => tx.timestamp >= oneDayAgo);
    
    // Add new transaction
    userTransactions.push({ amount, timestamp: now });
    
    // Save updated log
    this.transactionLog.set(userId, userTransactions);
  }
  
  // Calculate 24-hour total for a user
  private getDailyTotal(userId: string): number {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    const userTransactions = this.transactionLog.get(userId) || [];
    
    // Sum amounts from transactions in the last 24 hours
    return userTransactions
      .filter(tx => tx.timestamp >= oneDayAgo)
      .reduce((total, tx) => total + tx.amount, 0);
  }
  
  // Check if transaction is allowed
  async validateTransaction(check: TransactionSecurityCheck): Promise<TransactionValidationResult> {
    try {
      // Get user settings
      const settings = await this.getSettings(check.userId);
      
      // Check transaction amount limit
      if (check.amount > settings.max_transaction_amount) {
        return {
          allowed: false,
          reason: `Transaction amount exceeds your limit of ${settings.max_transaction_amount}`
        };
      }
      
      // Check daily amount limit
      const dailyTotal = this.getDailyTotal(check.userId) + check.amount;
      if (dailyTotal > settings.max_daily_amount) {
        return {
          allowed: false,
          reason: `Transaction would exceed your daily limit of ${settings.max_daily_amount}`
        };
      }
      
      // Check whitelist if enabled
      if (settings.whitelist_only) {
        const approvedAddresses = await this.getApprovedAddresses(check.userId);
        const isApproved = approvedAddresses.some(addr => addr.address.toLowerCase() === check.toAddress.toLowerCase());
        
        if (!isApproved) {
          return {
            allowed: false,
            reason: 'Recipient address is not in your approved addresses list'
          };
        }
      }
      
      // Track this transaction for future checks
      this.trackTransaction(check.userId, check.amount);
      
      // Return with optional delay
      return {
        allowed: true,
        delay: settings.delay_seconds ? settings.delay_seconds * 1000 : 0
      };
    } catch (error) {
      console.error('Error validating transaction:', error);
      errorCollector.captureError(error, {
        component: 'TransactionSecurityService',
        method: 'validateTransaction',
        details: { check }
      });
      
      // Default to allowing transaction on error, but notify user
      toast.error("Could not validate transaction security settings. Proceeding with caution.");
      return { allowed: true };
    }
  }
}

// Export singleton instance
export const transactionSecurityService = new TransactionSecurityService();
