
import React from "react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  username?: string | null;
  userLoading: boolean;
  isConnected: boolean;
  onRefreshData: () => void;
}

export function DashboardHeader({ username, userLoading, isConnected, onRefreshData }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Πίνακας Ελέγχου</h2>
        {!userLoading && username && (
          <p className="text-muted-foreground">
            Καλωσήρθατε{username ? `, ${username}` : ''}!
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={onRefreshData}
          disabled={!isConnected}
        >
          Ανανέωση Δεδομένων
        </Button>
      </div>
    </div>
  );
}
