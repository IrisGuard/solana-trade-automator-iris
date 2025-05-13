
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth"; 
import { ErrorLogsViewer } from "@/components/settings/ErrorLogsViewer";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Ρυθμίσεις</h2>
        <p className="text-muted-foreground">
          Διαχειριστείτε τις ρυθμίσεις του λογαριασμού και της εφαρμογής σας
        </p>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Λογαριασμός</TabsTrigger>
          <TabsTrigger value="appearance">Εμφάνιση</TabsTrigger>
          <TabsTrigger value="notifications">Ειδοποιήσεις</TabsTrigger>
          <TabsTrigger value="advanced">Προχωρημένες</TabsTrigger>
          <TabsTrigger value="diagnostics">Διαγνωστικά</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Πληροφορίες Λογαριασμού</CardTitle>
              <CardDescription>
                Διαχειριστείτε τις πληροφορίες του λογαριασμού σας
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="rounded p-2 bg-muted">{user?.email || "Δεν έχει οριστεί email"}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Ρυθμίσεις Εμφάνισης</CardTitle>
              <CardDescription>
                Προσαρμόστε την εμφάνιση της εφαρμογής
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-muted-foreground">
                Οι ρυθμίσεις εμφάνισης θα είναι διαθέσιμες σύντομα
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Ρυθμίσεις Ειδοποιήσεων</CardTitle>
              <CardDescription>
                Προσαρμόστε τις ειδοποιήσεις που λαμβάνετε
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-muted-foreground">
                Οι ρυθμίσεις ειδοποιήσεων θα είναι διαθέσιμες σύντομα
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Προχωρημένες Ρυθμίσεις</CardTitle>
              <CardDescription>
                Ρυθμίσεις για προχωρημένους χρήστες
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-muted-foreground">
                Οι προχωρημένες ρυθμίσεις θα είναι διαθέσιμες σύντομα
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diagnostics">
          <ErrorLogsViewer />
          
          <Card>
            <CardHeader>
              <CardTitle>Πληροφορίες Συστήματος</CardTitle>
              <CardDescription>
                Πληροφορίες για την έκδοση και το περιβάλλον της εφαρμογής
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm font-medium">Πρόγραμμα Περιήγησης</div>
                  <div className="text-sm text-muted-foreground">{navigator.userAgent}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Γλώσσα</div>
                  <div className="text-sm text-muted-foreground">{navigator.language}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
