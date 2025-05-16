
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeliusApiKeyForm } from '@/components/settings/HeliusApiKeyForm';
import { TransactionSecurityCard } from '@/components/security/TransactionSecurityCard';
import { ApiKeyCheckButton } from '@/components/security/ApiKeyCheckButton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function SettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Ρυθμίσεις</h1>
        </div>
        
        <ApiKeyCheckButton />
      </div>
      
      <Tabs defaultValue="api-keys" className="space-y-4">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="api-keys">API Κλειδιά</TabsTrigger>
          <TabsTrigger value="security">Ασφάλεια</TabsTrigger>
          <TabsTrigger value="preferences">Προτιμήσεις</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys" className="space-y-4">
          <HeliusApiKeyForm />
          
          <Card>
            <CardHeader>
              <CardTitle>API Κλειδιά</CardTitle>
              <CardDescription>
                Διαχειριστείτε τα API κλειδιά που χρησιμοποιούνται από την εφαρμογή.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Τα API κλειδιά είναι απαραίτητα για τη σύνδεση με διάφορες υπηρεσίες όπως το Helius για δεδομένα blockchain.
                Προσθέστε τα κλειδιά σας παραπάνω για να αποκτήσετε πρόσβαση σε όλες τις λειτουργίες της εφαρμογής.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <TransactionSecurityCard />
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Προτιμήσεις</CardTitle>
              <CardDescription>
                Προσαρμόστε τις ρυθμίσεις της εφαρμογής σας.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Οι ρυθμίσεις θέματος και εμφάνισης θα είναι διαθέσιμες σε μελλοντική έκδοση.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
