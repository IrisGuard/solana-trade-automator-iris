
import { useState, useEffect, useCallback } from 'react';
import { transactionSecurityService, TransactionSettings, ApprovedAddress } from '@/services/transactionSecurityService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useTransactionSecurity() {
  const { user } = useAuth();
  
  const [transactionSettings, setTransactionSettings] = useState<TransactionSettings | null>(null);
  const [approvedAddresses, setApprovedAddresses] = useState<ApprovedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [approvedAddressesEnabled, setApprovedAddressesEnabled] = useState(false);
  const [transactionDelaysEnabled, setTransactionDelaysEnabled] = useState(false);
  
  // Φόρτωση ρυθμίσεων κατά την αρχικοποίηση
  useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);
  
  const loadSettings = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Φόρτωση ρυθμίσεων συναλλαγών
      const settings = await transactionSecurityService.getTransactionSettings(user.id);
      setTransactionSettings(settings);
      setApprovedAddressesEnabled(settings.whitelist_only);
      setTransactionDelaysEnabled(settings.delay_seconds > 0);
      
      // Φόρτωση εγκεκριμένων διευθύνσεων
      const addresses = await transactionSecurityService.getApprovedAddresses(user.id);
      setApprovedAddresses(addresses);
    } catch (error) {
      console.error('Error loading security settings:', error);
      toast.error('Σφάλμα φόρτωσης ρυθμίσεων ασφαλείας');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Αποθήκευση ορίων συναλλαγών
  const saveTransactionLimits = useCallback(async (maxDailyAmount: number, maxTransactionAmount: number) => {
    if (!user?.id || !transactionSettings) return;
    
    setIsLoading(true);
    try {
      const updatedSettings = await transactionSecurityService.updateTransactionSettings(user.id, {
        max_daily_amount: maxDailyAmount,
        max_transaction_amount: maxTransactionAmount
      });
      
      setTransactionSettings(updatedSettings);
      toast.success('Τα όρια συναλλαγών αποθηκεύτηκαν με επιτυχία');
    } catch (error) {
      console.error('Error saving transaction limits:', error);
      toast.error('Σφάλμα κατά την αποθήκευση των ορίων συναλλαγών');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, transactionSettings]);
  
  // Ενημέρωση της ρύθμισης whitelist_only
  const updateWhitelistOnly = useCallback(async (enabled: boolean) => {
    if (!user?.id || !transactionSettings) return;
    
    setApprovedAddressesEnabled(enabled);
    setIsLoading(true);
    
    try {
      const updatedSettings = await transactionSecurityService.updateTransactionSettings(user.id, {
        whitelist_only: enabled
      });
      
      setTransactionSettings(updatedSettings);
      toast.success(enabled 
        ? 'Ενεργοποιήθηκε ο περιορισμός συναλλαγών σε εγκεκριμένες διευθύνσεις'
        : 'Απενεργοποιήθηκε ο περιορισμός συναλλαγών σε εγκεκριμένες διευθύνσεις'
      );
    } catch (error) {
      console.error('Error updating whitelist setting:', error);
      setApprovedAddressesEnabled(!enabled); // Επαναφορά σε περίπτωση σφάλματος
      toast.error('Σφάλμα κατά την ενημέρωση της ρύθμισης εγκεκριμένων διευθύνσεων');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, transactionSettings]);
  
  // Προσθήκη εγκεκριμένης διεύθυνσης
  const addApprovedAddress = useCallback(async (address: string, description?: string) => {
    if (!user?.id) return false;
    
    setIsLoading(true);
    try {
      const newAddress = await transactionSecurityService.addApprovedAddress({
        user_id: user.id,
        address,
        description,
        blockchain: 'solana' // Προεπιλεγμένη τιμή για το blockchain
      });
      
      setApprovedAddresses(prev => [...prev, newAddress]);
      toast.success('Η διεύθυνση προστέθηκε με επιτυχία');
      return true;
    } catch (error) {
      console.error('Error adding approved address:', error);
      toast.error('Σφάλμα κατά την προσθήκη της διεύθυνσης');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Αφαίρεση εγκεκριμένης διεύθυνσης
  const removeApprovedAddress = useCallback(async (addressId: string) => {
    setIsLoading(true);
    try {
      await transactionSecurityService.removeApprovedAddress(addressId);
      setApprovedAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast.success('Η διεύθυνση αφαιρέθηκε με επιτυχία');
    } catch (error) {
      console.error('Error removing approved address:', error);
      toast.error('Σφάλμα κατά την αφαίρεση της διεύθυνσης');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Ενημέρωση της ρύθμισης καθυστέρησης συναλλαγών
  const updateTransactionDelay = useCallback(async (enabled: boolean, delaySeconds: number = 30) => {
    if (!user?.id || !transactionSettings) return;
    
    setTransactionDelaysEnabled(enabled);
    setIsLoading(true);
    
    try {
      const updatedSettings = await transactionSecurityService.updateTransactionSettings(user.id, {
        delay_seconds: enabled ? delaySeconds : 0
      });
      
      setTransactionSettings(updatedSettings);
      toast.success(enabled 
        ? `Ενεργοποιήθηκε η καθυστέρηση συναλλαγών (${delaySeconds} δευτερόλεπτα)`
        : 'Απενεργοποιήθηκε η καθυστέρηση συναλλαγών'
      );
    } catch (error) {
      console.error('Error updating delay setting:', error);
      setTransactionDelaysEnabled(!enabled); // Επαναφορά σε περίπτωση σφάλματος
      toast.error('Σφάλμα κατά την ενημέρωση της ρύθμισης καθυστέρησης συναλλαγών');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, transactionSettings]);
  
  return {
    transactionSettings,
    approvedAddresses,
    isLoading,
    approvedAddressesEnabled,
    transactionDelaysEnabled,
    saveTransactionLimits,
    updateWhitelistOnly,
    addApprovedAddress,
    removeApprovedAddress,
    updateTransactionDelay
  };
}
