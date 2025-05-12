
import React from "react";
import { Key } from "lucide-react";

export const EmptyKeyList: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
      <Key className="h-12 w-12 mb-2 opacity-20" />
      <p>Δεν βρέθηκαν κλειδιά API</p>
    </div>
  );
};
