
import React from "react";
import { Loader2 } from "lucide-react";

export function ApiKeysLoading() {
  return (
    <div className="flex justify-center py-4">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
