
import React from "react";
import { Clock, XCircle, CheckCircle } from "lucide-react";

interface KeyStatusIconProps {
  status?: string;
}

export const KeyStatusIcon: React.FC<KeyStatusIconProps> = ({ status }) => {
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
