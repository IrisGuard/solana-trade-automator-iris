
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Key } from "lucide-react";
import { ApiServiceCard } from "./ApiServiceCard";
import { SupabaseApiKeysList } from "@/components/security/api-keys/SupabaseApiKeysList";

interface ManageTabContentProps {
  userId?: string;
}

export function ManageTabContent({ userId }: ManageTabContentProps) {
  return (
    <div className="space-y-4 mt-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Διαχείριση API Κλειδιών</CardTitle>
              <CardDescription>
                Προσθέστε, επεξεργαστείτε και διαγράψτε τα API κλειδιά των υπηρεσιών σας
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ApiServiceCard
                title="Helius API"
                description="Κλειδιά για πρόσβαση στο Helius API (συναλλαγές Solana)"
                info="Το Helius παρέχει πρόσβαση σε δεδομένα συναλλαγών και NFT στο Solana blockchain."
                status="active"
                onManage={() => console.log("Manage Helius")}
              />
              
              <ApiServiceCard
                title="Solana RPC"
                description="RPC endpoints για σύνδεση με το Solana blockchain"
                info="Επιτρέπει άμεση επικοινωνία με το δίκτυο Solana για συναλλαγές και ερωτήματα."
                status="active"
                onManage={() => console.log("Manage Solana RPC")}
              />
              
              <ApiServiceCard
                title="Price APIs"
                description="Κλειδιά για υπηρεσίες τιμών κρυπτονομισμάτων"
                info="Παρέχει πρόσβαση σε δεδομένα τιμών από υπηρεσίες όπως CoinGecko και Cryptocompare."
                status="partial"
                onManage={() => console.log("Manage Price APIs")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {userId && <SupabaseApiKeysList userId={userId} />}
    </div>
  );
}
