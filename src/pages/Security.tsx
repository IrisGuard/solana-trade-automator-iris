
import React from "react";
import { TwoFactorCard } from "@/components/security/TwoFactorCard";
import { AccountAccessCard } from "@/components/security/AccountAccessCard";
import { TransactionSecurityCard } from "@/components/security/TransactionSecurityCard";
import { SessionsCard } from "@/components/security/SessionsCard";
import { PlatformSecurityCard } from "@/components/security/PlatformSecurityCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

export default function Security() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gradient mb-1">Security</h2>
        <p className="text-muted-foreground">
          Manage your security settings and account protection
        </p>
      </div>
      
      <Alert className="bg-primary/5 border border-primary/20">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <AlertTitle className="text-foreground">Enhanced Security</AlertTitle>
        <AlertDescription className="text-foreground/90">
          Our platform uses advanced security measures to protect your account and transactions.
        </AlertDescription>
      </Alert>
      
      {/* Security cards for users */}
      <div className="grid gap-6 md:grid-cols-2">
        <TwoFactorCard />
        <AccountAccessCard />
      </div>
      
      <TransactionSecurityCard />
      <SessionsCard />
      <PlatformSecurityCard />
      
      {/* Simplified platform security information card */}
      <Card className="card-highlight">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Platform Security</CardTitle>
          <CardDescription>
            Our platform features advanced security measures managed by the support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-foreground">Multi-layer Security</h4>
              <p className="text-sm text-muted-foreground">
                Our platform implements multi-layer security, including data encryption and advanced access controls.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-foreground">Regular Audits</h4>
              <p className="text-sm text-muted-foreground">
                We conduct regular security audits to ensure the system is protected from the latest threats.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
