
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, FileText, MessageSquare, BookOpen, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Help() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Βοήθεια & Υποστήριξη
          </CardTitle>
          <CardDescription>Βρείτε απαντήσεις στις ερωτήσεις σας και υποστήριξη για την πλατφόρμα</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="faq" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="faq">Συχνές Ερωτήσεις</TabsTrigger>
              <TabsTrigger value="guides">Οδηγοί Χρήσης</TabsTrigger>
              <TabsTrigger value="support">Επικοινωνία</TabsTrigger>
              <TabsTrigger value="resources">Πόροι</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Πώς συνδέω το πορτοφόλι μου;</h3>
                <p className="text-muted-foreground">
                  Για να συνδέσετε το πορτοφόλι σας, κάντε κλικ στο κουμπί "Σύνδεση Πορτοφολιού" 
                  στην κεφαλίδα. Υποστηρίζουμε το Phantom Wallet για το Solana blockchain.
                </p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Πώς λειτουργεί το Trading Bot;</h3>
                <p className="text-muted-foreground">
                  Το Trading Bot παρακολουθεί τις τιμές των tokens σε πραγματικό χρόνο και εκτελεί συναλλαγές 
                  βάσει των παραμέτρων που έχετε ορίσει. Δείτε περισσότερες πληροφορίες στη σελίδα Dashboard.
                </p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Είναι ασφαλείς οι συναλλαγές μου;</h3>
                <p className="text-muted-foreground">
                  Όλες οι συναλλαγές εκτελούνται απευθείας από το πορτοφόλι σας και απαιτούν την έγκρισή σας. 
                  Δεν έχουμε πρόσβαση στα ιδιωτικά κλειδιά σας και όλες οι επικοινωνίες είναι κρυπτογραφημένες.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Ρύθμιση Trading Bot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Οδηγίες για τη ρύθμιση και παραμετροποίηση του Trading Bot σας.
                    </p>
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm">Δείτε τον οδηγό</Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Διαχείριση Πορτοφολιού
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Πώς να διαχειριστείτε το πορτοφόλι και τα tokens σας αποτελεσματικά.
                    </p>
                    <Link to="/wallet">
                      <Button variant="outline" size="sm">Δείτε τον οδηγό</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="support" className="space-y-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Επικοινωνία με Υποστήριξη</h3>
                  <p className="text-muted-foreground mb-3">
                    Στείλτε μας email στο <span className="font-medium">support@solanatrader.example</span> και θα σας απαντήσουμε εντός 24 ωρών.
                  </p>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Κοινότητα</h3>
                  <p className="text-muted-foreground mb-3">
                    Συνδεθείτε με άλλους traders και λάβετε βοήθεια από την κοινότητα.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Discord
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Telegram
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Solana Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Επίσημη τεκμηρίωση για το Solana blockchain και τις λειτουργίες του.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => window.open("https://docs.solana.com", "_blank")}>
                      <LinkIcon className="h-3 w-3" /> Άνοιγμα
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Trading Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Οδηγός για αποτελεσματικές στρατηγικές trading στο Solana.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <LinkIcon className="h-3 w-3" /> Άνοιγμα
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
