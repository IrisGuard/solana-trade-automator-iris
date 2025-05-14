
import { useState } from "react";
import { toast } from "sonner";

export function useTransactionSecurity() {
  const [confirmationEnabled, setConfirmationEnabled] = useState(true);
  const [approvedAddressesEnabled, setApprovedAddressesEnabled] = useState(false);
  const [delayEnabled, setDelayEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [geoRestrictionsEnabled, setGeoRestrictionsEnabled] = useState(false);

  const saveTransactionLimits = () => {
    toast.success("Τα όρια συναλλαγών αποθηκεύτηκαν");
  };

  const addApprovedAddress = (address: string, description: string) => {
    // Implementation for adding approved addresses
    toast.success(`Η διεύθυνση ${address} προστέθηκε στις εγκεκριμένες`);
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
    saveTransactionLimits,
    addApprovedAddress
  };
}
