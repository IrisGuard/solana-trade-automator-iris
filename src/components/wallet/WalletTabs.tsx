
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function WalletTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid grid-cols-3 lg:grid-cols-5">
        <TabsTrigger value="overview">Επισκόπηση</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="transactions">Συναλλαγές</TabsTrigger>
        <TabsTrigger value="trading">Trading</TabsTrigger>
        <TabsTrigger value="settings">Ρυθμίσεις</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Επισκόπηση Πορτοφολιού</CardTitle>
            <CardDescription>Δείτε μια συνολική εικόνα του πορτοφολιού σας</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-lg font-semibold mb-1">Συνολική Αξία</div>
                <div className="text-3xl font-bold">$0.00</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-lg font-semibold mb-1">Πρόσφατη Αλλαγή</div>
                <div className="text-3xl font-bold text-green-500">0.00%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="tokens">
        <Card>
          <CardHeader>
            <CardTitle>Τα Tokens Μου</CardTitle>
            <CardDescription>Διαχειριστείτε τα tokens σας στο Solana blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Συνδεθείτε με το πορτοφόλι σας για να δείτε τα tokens σας
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="transactions">
        <Card>
          <CardHeader>
            <CardTitle>Ιστορικό Συναλλαγών</CardTitle>
            <CardDescription>Δείτε το ιστορικό των συναλλαγών σας</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Δεν υπάρχουν συναλλαγές για προβολή
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="trading">
        <Card>
          <CardHeader>
            <CardTitle>Trading</CardTitle>
            <CardDescription>Διαχειριστείτε τις συναλλαγές σας</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Λειτουργία σε εξέλιξη
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Ρυθμίσεις Πορτοφολιού</CardTitle>
            <CardDescription>Προσαρμόστε τις ρυθμίσεις του πορτοφολιού σας</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Λειτουργία σε εξέλιξη
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
