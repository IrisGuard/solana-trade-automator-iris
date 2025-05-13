
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TransactionSecurityHeader } from "./transaction/TransactionSecurityHeader";
import { TransactionConfirmationSection } from "./transaction/TransactionConfirmationSection";
import { TransactionLimitsSection } from "./transaction/TransactionLimitsSection";
import { ApprovedAddressesSection } from "./transaction/ApprovedAddressesSection";
import { AdvancedSecuritySettings } from "./transaction/AdvancedSecuritySettings";

export const TransactionSecurityCard = () => {
  return (
    <Card className="card-highlight">
      <CardHeader>
        <TransactionSecurityHeader />
      </CardHeader>
      <CardContent className="space-y-6">
        <TransactionConfirmationSection />
        
        <Separator className="bg-border" />
        
        <TransactionLimitsSection />
        
        <Separator className="bg-border" />
        
        <ApprovedAddressesSection />
        
        <Separator className="bg-border" />
        
        <AdvancedSecuritySettings />
      </CardContent>
    </Card>
  );
};
