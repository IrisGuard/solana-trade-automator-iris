
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupabaseApiKeysList } from "@/components/security/api-keys/SupabaseApiKeysList";
import { ApiKeysExporter } from "@/components/security/api-keys/ApiKeysExporter";
import { ApiKeysImporter } from "@/components/security/api-keys/ApiKeysImporter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { Key, Shield, InfoIcon } from "lucide-react";

export default function ApiVault() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = React.useState("manage");

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">API Κλειδιά</h2>
            <p className="text-muted-foreground">
              Διαχειριστείτε με ασφάλεια τα API κλειδιά των υπηρεσιών σας
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Απαιτείται Σύνδεση</CardTitle>
            <CardDescription>
              Παρακαλώ συνδεθείτε για να διαχειριστείτε τα API κλειδιά σας
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button>Σύνδεση</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Κλειδιά</h2>
          <p className="text-muted-foreground">
            Διαχειριστείτε με ασφάλεια τα API κλειδιά των υπηρεσιών σας
          </p>
        </div>
      </div>

      <Alert className="bg-primary/5 border border-primary/20">
        <InfoIcon className="h-5 w-5 text-primary" />
        <AlertTitle>Τι είναι το API Vault;</AlertTitle>
        <AlertDescription>
          Το API Vault είναι ένα ασφαλές αποθετήριο για τα API κλειδιά σας. Σας επιτρέπει να αποθηκεύετε, 
          να διαχειρίζεστε και να χρησιμοποιείτε τα κλειδιά σας για υπηρεσίες όπως το Helius, Solana RPC 
          και άλλες πλατφόρμες, χωρίς να χρειάζεται να τα εισάγετε κάθε φορά. Όλα τα κλειδιά αποθηκεύονται 
          κρυπτογραφημένα για μέγιστη ασφάλεια.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage">Διαχείριση</TabsTrigger>
          <TabsTrigger value="export">Εξαγωγή</TabsTrigger>
          <TabsTrigger value="import">Εισαγωγή</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4 mt-4">
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
                  <Card className="bg-card/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Helius API</CardTitle>
                      <CardDescription>
                        Κλειδιά για πρόσβαση στο Helius API (συναλλαγές Solana)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Το Helius παρέχει πρόσβαση σε δεδομένα συναλλαγών και NFT στο Solana blockchain.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Κατάσταση: <span className="text-green-500">Ενεργό</span></span>
                        <Button variant="outline" size="sm">Διαχείριση</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Solana RPC</CardTitle>
                      <CardDescription>
                        RPC endpoints για σύνδεση με το Solana blockchain
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Επιτρέπει άμεση επικοινωνία με το δίκτυο Solana για συναλλαγές και ερωτήματα.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Κατάσταση: <span className="text-green-500">Ενεργό</span></span>
                        <Button variant="outline" size="sm">Διαχείριση</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Price APIs</CardTitle>
                      <CardDescription>
                        Κλειδιά για υπηρεσίες τιμών κρυπτονομισμάτων
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Παρέχει πρόσβαση σε δεδομένα τιμών από υπηρεσίες όπως CoinGecko και Cryptocompare.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Κατάσταση: <span className="text-yellow-500">Μερικό</span></span>
                        <Button variant="outline" size="sm">Διαχείριση</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <SupabaseApiKeysList userId={user.id} />
        </TabsContent>

        <TabsContent value="export" className="space-y-4 mt-4">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Ασφαλής Εξαγωγή Κλειδιών</CardTitle>
                  <CardDescription>
                    Εξάγετε τα API κλειδιά σας με κρυπτογράφηση για ασφαλή αποθήκευση
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Η εξαγωγή των API κλειδιών σας γίνεται με κρυπτογράφηση για μέγιστη ασφάλεια. 
                    Θα χρειαστεί να ορίσετε έναν κωδικό κρυπτογράφησης που θα χρησιμοποιήσετε για 
                    να εισάγετε ξανά τα κλειδιά αργότερα.
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  Η εξαγωγή είναι χρήσιμη για τη μεταφορά των κλειδιών σας σε άλλη εγκατάσταση της πλατφόρμας 
                  ή ως αντίγραφο ασφαλείας.
                </p>
              </div>
            </CardContent>
          </Card>

          <ApiKeysExporter userId={user.id} />
        </TabsContent>

        <TabsContent value="import" className="space-y-4 mt-4">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Εισαγωγή Κλειδιών</CardTitle>
                  <CardDescription>
                    Εισάγετε κλειδιά από εξαγωγή ή προσθέστε νέα
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Για την εισαγωγή κρυπτογραφημένων κλειδιών, θα χρειαστεί να εισάγετε τον κωδικό 
                    κρυπτογράφησης που χρησιμοποιήσατε κατά την εξαγωγή τους.
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  Μπορείτε επίσης να προσθέσετε νέα API κλειδιά χειροκίνητα συμπληρώνοντας τα απαραίτητα πεδία.
                </p>
              </div>
            </CardContent>
          </Card>

          <ApiKeysImporter userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
