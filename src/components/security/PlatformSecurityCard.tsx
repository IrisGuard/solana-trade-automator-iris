
import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { PlatformSecurityHeader } from "./platformSecurity/PlatformSecurityHeader";
import { SecurityTable } from "./platformSecurity/SecurityTable";
import { SaveSettings } from "./platformSecurity/SaveSettings";
import { usePlatformSecurity } from "./platformSecurity/usePlatformSecurity";

export const PlatformSecurityCard = () => {
  const { 
    expanded, 
    securitySettings, 
    toggleExpanded, 
    handleToggle, 
    handleEnableAll, 
    handleDisableAll, 
    handleSaveSettings 
  } = usePlatformSecurity();

  return (
    <Card>
      <CardHeader>
        <PlatformSecurityHeader expanded={expanded} onToggle={toggleExpanded} />
        <CardDescription>
          Ελέγξτε τις κύριες ρυθμίσεις ασφαλείας της πλατφόρμας
        </CardDescription>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-6">
          <SecurityTable 
            securitySettings={securitySettings}
            handleToggle={handleToggle}
            handleEnableAll={handleEnableAll}
            handleDisableAll={handleDisableAll}
          />
          
          <SaveSettings onSave={handleSaveSettings} />
        </CardContent>
      )}
    </Card>
  );
}
