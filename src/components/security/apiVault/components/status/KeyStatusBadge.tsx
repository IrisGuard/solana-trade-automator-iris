
import React from "react";
import { Badge } from "@/components/ui/badge";

interface KeyStatusBadgeProps {
  status?: string;
  isWorking?: boolean;
}

export const KeyStatusBadge: React.FC<KeyStatusBadgeProps> = ({ status, isWorking }) => {
  // Εμφάνιση κατάστασης λειτουργίας αν έχει οριστεί
  if (isWorking === false) {
    return (
      <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
        Μη Λειτουργικό
      </Badge>
    );
  } else if (isWorking === true) {
    return (
      <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
        Λειτουργικό
      </Badge>
    );
  }
  
  // Διαφορετικά, εμφάνιση κατάστασης κλειδιού
  switch (status) {
    case "expired":
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
          Ληγμένο
        </Badge>
      );
    case "revoked":
      return (
        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
          Ανακλημένο
        </Badge>
      );
    case "active":
    default:
      return (
        <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
          Ενεργό
        </Badge>
      );
  }
};
