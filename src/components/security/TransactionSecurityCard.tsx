
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TransactionConfirmationSection } from "./transaction/TransactionConfirmationSection";
import { TransactionLimitsSection } from "./transaction/TransactionLimitsSection";
import { ApprovedAddressesSection } from "./transaction/ApprovedAddressesSection";
import { AdvancedSecuritySettings } from "./transaction/AdvancedSecuritySettings";

export const TransactionSecurityCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <CardTitle>Ασφάλεια Συναλλαγών</CardTitle>
        </div>
        <CardDescription>Ελέγξτε τις ρυθμίσεις ασφαλείας των συναλλαγών σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TransactionConfirmationSection />
        
        <Separator />
        
        <TransactionLimitsSection />
        
        <Separator />
        
        <ApprovedAddressesSection />
        
        <Separator />
        
        <AdvancedSecuritySettings />
      </CardContent>
    </Card>
  );
};
