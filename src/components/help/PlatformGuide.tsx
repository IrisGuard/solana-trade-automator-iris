
import React from "react";
import { ExternalLink, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PlatformGuide() {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 space-y-6">
      <section className="space-y-2">
        <h3 className="text-lg font-medium">{t("help.platformGuide")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("help.shortGuide")}
        </p>
      </section>
      
      {/* Βασικές Λειτουργίες - Πορτοφόλι */}
      <Accordion type="single" collapsible>
        <AccordionItem value="wallet">
          <AccordionTrigger className="text-base font-medium">{t("help.walletConnection")}</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <p className="text-sm">
              {t("wallet.connectionInstructions")}
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Βασικές λειτουργίες πορτοφολιού:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Προβολή υπολοίπου SOL και tokens</li>
                <li>Ιστορικό συναλλαγών</li>
                <li>Αποστολή και λήψη κρυπτονομισμάτων</li>
                <li>Ανταλλαγή tokens μέσω του Jupiter Aggregator</li>
              </ul>
            </div>
            <div className="bg-muted p-2 rounded text-sm">
              <strong>Συμβουλή:</strong> Για βέλτιστη ασφάλεια, συνδέστε ένα hardware wallet όπως το Ledger για συναλλαγές μεγάλης αξίας.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Bots Trading */}
      <Accordion type="single" collapsible>
        <AccordionItem value="bots">
          <AccordionTrigger className="text-base font-medium">{t("help.tradingBots")}</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <p className="text-sm">
              {t("help.botsDescription")}
            </p>
            
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Trading Bot</CardTitle>
                <CardDescription className="text-xs">Αυτοματοποιημένες συναλλαγές</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>{t("help.tradingBotDescription")}</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Υποστηρίζει πολλαπλές στρατηγικές: Grid, DCA, Momentum</li>
                  <li>Ρυθμιζόμενα όρια stop-loss και take-profit</li>
                  <li>Λειτουργία backtesting για δοκιμή στρατηγικών</li>
                  <li>Αυτόματη επανεπένδυση κερδών (compounding)</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Maker Bot</CardTitle>
                <CardDescription className="text-xs">Δημιουργία ρευστότητας</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>{t("help.makerBotDescription")}</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Ρύθμιση spread μεταξύ τιμών αγοράς-πώλησης</li>
                  <li>Έλεγχος όγκου συναλλαγών</li>
                  <li>Δυναμική προσαρμογή στις συνθήκες αγοράς</li>
                  <li>Παραμετροποίηση συχνότητας συναλλαγών</li>
                </ul>
              </CardContent>
            </Card>
            
            <div className="bg-muted p-2 rounded text-sm">
              <strong>Για δημιουργία bot:</strong> Μεταβείτε στη σελίδα "Bots" και επιλέξτε "Δημιουργία Bot" ή χρησιμοποιήστε την εντολή <code>/bot create</code>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* API Vault */}
      <Accordion type="single" collapsible>
        <AccordionItem value="api">
          <AccordionTrigger className="text-base font-medium">{t("help.apiVaultHelp")}</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <p className="text-sm">
              {t("help.apiVaultDescription")}
            </p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Υποστηριζόμενες υπηρεσίες:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><strong>Helius:</strong> Πρόσβαση σε δεδομένα blockchain και RPC endpoints με υψηλή απόδοση</li>
                <li><strong>Coingecko:</strong> Δεδομένα τιμών και αγορών για κρυπτονομίσματα</li>
                <li><strong>Jupiter:</strong> Προηγμένες λειτουργίες για ανταλλαγή tokens</li>
                <li><strong>Άλλες υπηρεσίες Solana:</strong> Magic Eden, Tensor, κ.α.</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Λειτουργίες ασφαλείας:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Κρυπτογράφηση AES-256 για όλα τα αποθηκευμένα κλειδιά</li>
                <li>Ελεγχόμενη πρόσβαση με κύριο κωδικό</li>
                <li>Εξαγωγή και εισαγωγή κρυπτογραφημένων κλειδιών</li>
                <li>Αυτόματη αποσύνδεση μετά από περίοδο αδράνειας</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Ανάλυση Δεδομένων */}
      <Accordion type="single" collapsible>
        <AccordionItem value="analytics">
          <AccordionTrigger className="text-base font-medium">Ανάλυση Δεδομένων</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <p className="text-sm">
              Η πλατφόρμα παρέχει εκτενή εργαλεία ανάλυσης για την παρακολούθηση της απόδοσης των συναλλαγών και των bots σας.
            </p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Διαθέσιμες αναλύσεις:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Ιστορικό απόδοσης bot με γραφήματα και μετρήσεις</li>
                <li>Συγκριτική ανάλυση στρατηγικών</li>
                <li>Προβολή κερδών/ζημιών ανά token και χρονική περίοδο</li>
                <li>Εξαγωγή δεδομένων σε διάφορες μορφές (CSV, JSON)</li>
              </ul>
            </div>
            
            <div className="bg-muted p-2 rounded text-sm">
              <strong>Πρόσβαση:</strong> Επισκεφθείτε την ενότητα "Analytics" στο μενού πλοήγησης για πρόσβαση σε όλα τα εργαλεία ανάλυσης.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Ασφάλεια Συναλλαγών */}
      <Accordion type="single" collapsible>
        <AccordionItem value="security">
          <AccordionTrigger className="text-base font-medium">Ασφάλεια Συναλλαγών</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <p className="text-sm">
              Η πλατφόρμα παρέχει προηγμένα χαρακτηριστικά ασφαλείας για την προστασία των συναλλαγών και των κεφαλαίων σας.
            </p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Χαρακτηριστικά ασφαλείας:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Πολλαπλοί έλεγχοι επαλήθευσης πριν την εκτέλεση συναλλαγών</li>
                <li>Ειδοποιήσεις για ύποπτες συναλλαγές</li>
                <li>Γεωγραφικοί περιορισμοί πρόσβασης</li>
                <li>Ρυθμιζόμενα όρια συναλλαγών</li>
                <li>Καθυστερήσεις συναλλαγών για αυξημένη προστασία</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Χρήσιμοι Σύνδεσμοι */}
      <section className="space-y-2">
        <h4 className="font-medium">{t("help.usefulLinks")}</h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <a 
            href="https://solana.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Solana Website <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="https://phantom.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Phantom Wallet <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="https://jup.ag" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Jupiter Aggregator <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="https://helius.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Helius API <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="https://docs.solana.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Solana Documentation <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="https://coingecko.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            CoinGecko API <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>
      
      {/* Γρήγορη Έναρξη */}
      <section className="mt-6 pt-4 border-t">
        <h4 className="font-medium text-base mb-3">Γρήγορη Έναρξη</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center text-xs text-primary-foreground">1</div>
            <div>
              <h5 className="font-medium text-sm">{t("platform.step1Title")}</h5>
              <p className="text-sm text-muted-foreground">{t("platform.step1Desc")}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center text-xs text-primary-foreground">2</div>
            <div>
              <h5 className="font-medium text-sm">{t("platform.step2Title")}</h5>
              <p className="text-sm text-muted-foreground">{t("platform.step2Desc")}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center text-xs text-primary-foreground">3</div>
            <div>
              <h5 className="font-medium text-sm">{t("platform.step3Title")}</h5>
              <p className="text-sm text-muted-foreground">{t("platform.step3Desc")}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center text-xs text-primary-foreground">4</div>
            <div>
              <h5 className="font-medium text-sm">{t("platform.step4Title")}</h5>
              <p className="text-sm text-muted-foreground">{t("platform.step4Desc")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
