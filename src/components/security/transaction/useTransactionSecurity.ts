
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { securityService, TransactionSettings, ApprovedAddress } from "@/services/securityService";

export function useTransactionSecurity() {
  const [confirmationEnabled, setConfirmationEnabled] = useState(true);
  const [approvedAddressesEnabled, setApprovedAddressesEnabled] = useState(false);
  const [delayEnabled, setDelayEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [geoRestrictionsEnabled, setGeoRestrictionsEnabled] = useState(false);
  const [transactionSettings, setTransactionSettings] = useState<TransactionSettings | null>(null);
  const [approvedAddresses, setApprovedAddresses] = useState<ApprovedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadSettings();
      loadApprovedAddresses();
    }
  }, [user?.id]);

  const loadSettings = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    
    try {
      const settings = await securityService.getTransactionSettings(user.id);
      if (settings) {
        setTransactionSettings(settings);
        setApprovedAddressesEnabled(settings.whitelist_only);
        setDelayEnabled(settings.delay_seconds > 0);
        setNotificationsEnabled(settings.notification_email || settings.notification_app);
      }
    } catch (error) {
      console.error("Error loading transaction settings:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadApprovedAddresses = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    
    try {
      const addresses = await securityService.getApprovedAddresses(user.id);
      setApprovedAddresses(addresses);
    } catch (error) {
      console.error("Error loading approved addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTransactionLimits = async (maxDaily: number, maxTransaction: number) => {
    if (!user?.id || !transactionSettings) return;
    
    try {
      const updatedSettings = await securityService.updateTransactionSettings({
        ...transactionSettings,
        max_daily_amount: maxDaily,
        max_transaction_amount: maxTransaction
      });
      
      if (updatedSettings) {
        setTransactionSettings(updatedSettings);
        toast.success("Τα όρια συναλλαγών αποθηκεύτηκαν");
      }
    } catch (error) {
      console.error("Error saving transaction limits:", error);
      toast.error("Σφάλμα κατά την αποθήκευση των ορίων συναλλαγών");
    }
  };
  
  const updateWhitelistOnly = async (enabled: boolean) => {
    if (!user?.id || !transactionSettings) return;
    
    try {
      const updatedSettings = await securityService.updateTransactionSettings({
        ...transactionSettings,
        whitelist_only: enabled
      });
      
      if (updatedSettings) {
        setTransactionSettings(updatedSettings);
        setApprovedAddressesEnabled(enabled);
      }
    } catch (error) {
      console.error("Error updating whitelist setting:", error);
    }
  };
  
  const updateDelaySettings = async (enabled: boolean, seconds: number = 0) => {
    if (!user?.id || !transactionSettings) return;
    
    try {
      const updatedSettings = await securityService.updateTransactionSettings({
        ...transactionSettings,
        delay_seconds: enabled ? seconds : 0
      });
      
      if (updatedSettings) {
        setTransactionSettings(updatedSettings);
        setDelayEnabled(enabled && updatedSettings.delay_seconds > 0);
      }
    } catch (error) {
      console.error("Error updating delay settings:", error);
    }
  };
  
  const updateNotificationSettings = async (email: boolean, app: boolean) => {
    if (!user?.id || !transactionSettings) return;
    
    try {
      const updatedSettings = await securityService.updateTransactionSettings({
        ...transactionSettings,
        notification_email: email,
        notification_app: app
      });
      
      if (updatedSettings) {
        setTransactionSettings(updatedSettings);
        setNotificationsEnabled(email || app);
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };

  const addApprovedAddress = async (address: string, description: string) => {
    if (!user?.id) return;
    
    try {
      const newAddress = await securityService.addApprovedAddress({
        user_id: user.id,
        address,
        description,
        blockchain: 'solana'
      });
      
      if (newAddress) {
        setApprovedAddresses(prevAddresses => [...prevAddresses, newAddress]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding approved address:", error);
      return false;
    }
  };
  
  const removeApprovedAddress = async (addressId: string) => {
    try {
      const success = await securityService.removeApprovedAddress(addressId);
      
      if (success) {
        setApprovedAddresses(prevAddresses => 
          prevAddresses.filter(addr => addr.id !== addressId)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing approved address:", error);
      return false;
    }
  };

  return {
    confirmationEnabled,
    setConfirmationEnabled,
    approvedAddressesEnabled,
    setApprovedAddressesEnabled,
    delayEnabled,
    setDelayEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    geoRestrictionsEnabled,
    setGeoRestrictionsEnabled,
    transactionSettings,
    approvedAddresses,
    isLoading,
    saveTransactionLimits,
    addApprovedAddress,
    removeApprovedAddress,
    updateWhitelistOnly,
    updateDelaySettings,
    updateNotificationSettings
  };
}
