
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SolanaResourceList } from "./solana/SolanaResourceList";
import { SystemProtectionGuide } from "./SystemProtectionGuide";
import { Shield, BookOpen, FileText, Database } from "lucide-react";

export function SolanaDocumentation() {
  return (
    <div className="p-4">
      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Πόροι Solana
          </TabsTrigger>
          <TabsTrigger value="protection" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Προστασία Συστήματος
          </TabsTrigger>
          <TabsTrigger value="apis" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            API Τεκμηρίωση
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Δομή Δεδομένων
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          <SolanaResourceList />
        </TabsContent>
        
        <TabsContent value="protection">
          <SystemProtectionGuide />
        </TabsContent>
        
        <TabsContent value="apis">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Τεκμηρίωση API</h3>
            <p className="text-muted-foreground">
              Αναλυτική τεκμηρίωση για τα APIs της πλατφόρμας και τον τρόπο χρήσης τους.
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium">Helius API</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Πρόσβαση σε δεδομένα Solana blockchain, συναλλαγές και NFTs μέσω του Helius.
                </p>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium">Jupiter Aggregator API</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Βελτιστοποιημένη εκτέλεση συναλλαγών με τις καλύτερες τιμές και χαμηλά fees.
                </p>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium">Internal Platform APIs</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Εσωτερικά APIs για τον έλεγχο των bots, τη διαχείριση των κλειδιών και την παρακολούθηση των συναλλαγών.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="database">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Δομή Δεδομένων</h3>
            <p className="text-muted-foreground">
              Πληροφορίες για τη δομή των δεδομένων και την αποθήκευσή τους στην εφαρμογή.
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium">Αποθήκευση API Κλειδιών</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Τα κλειδιά API αποθηκεύονται με ασφάλεια με κρυπτογράφηση AES-256 και προστασία για παρεμβολές.
                </p>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium">Δεδομένα Bots</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Οι ρυθμίσεις και τα δεδομένα απόδοσης των bots αποθηκεύονται σε κρυπτογραφημένη μορφή στο localStorage και συγχρονίζονται με ασφάλεια με το backend.
                </p>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium">Αντίγραφα Ασφαλείας</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Τα αντίγραφα ασφαλείας της δομής της εφαρμογής αποθηκεύονται με αυξημένη πλεονασμό για διασφάλιση της ακεραιότητας των δεδομένων.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
