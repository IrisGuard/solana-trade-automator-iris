
import React from "react";
import { Clock, XCircle, CheckCircle, AlertCircle } from "lucide-react";

interface KeyStatusIconProps {
  status?: string;
  isWorking?: boolean;
}

export const KeyStatusIcon: React.FC<KeyStatusIconProps> = ({ status, isWorking }) => {
  // Προτεραιότητα στην κατάσταση λειτουργίας αν έχει οριστεί
  if (isWorking === false) {
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  } else if (isWorking === true) {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
  
  // Διαφορετικά, εμφάνιση εικονιδίου κατάστασης
  switch (status) {
    case "expired":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "revoked":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "active":
    default:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
};
