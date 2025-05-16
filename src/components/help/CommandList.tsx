import React, { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Λίστα με εντολές και την περιγραφή τους, οργανωμένες κατά κατηγορία
const COMMANDS_BY_CATEGORY = {
  wallet: [
    {
      command: "/connect",
      descriptionKey: "wallet.connectWallet",
      details: "Συνδέει το Solana πορτοφόλι σας στην πλατφόρμα."
    },
    {
      command: "/disconnect",
      descriptionKey: "wallet.disconnectWallet",
      details: "Αποσυνδέει το τρέχον συνδεδεμένο πορτοφόλι."
    },
    {
      command: "/balance",
      descriptionKey: "wallet.walletBalance",
      details: "Εμφανίζει το τρέχον υπόλοιπο SOL στο συνδεδεμένο πορτοφόλι."
    },
    {
      command: "/tokens",
      descriptionKey: "wallet.tokensBalance",
      details: "Προβάλλει αναλυτική λίστα των tokens και των υπολοίπων τους στο πορτοφόλι σας."
    },
    {
      command: "/swap [ποσό] [από] [προς]",
      descriptionKey: "Ανταλλάσσει tokens",
      details: "Εκτελεί ανταλλαγή μεταξύ tokens (π.χ. /swap 10 SOL USDC). Χρησιμοποιεί το Jupiter Aggregator για βέλτιστες τιμές."
    },
  ],
  bots: [
    {
      command: "/bot start [όνομα]",
      descriptionKey: "makerBot.startBot",
      details: "Εκκινεί το bot με το συγκεκριμένο όνομα. Αν δεν δοθεί όνομα, ζητά επιβεβαίωση για την εκκίνηση όλων των bots."
    },
    {
      command: "/bot stop [όνομα]",
      descriptionKey: "makerBot.stopBot",
      details: "Σταματά το bot με το συγκεκριμένο όνομα. Αν δεν δοθεί όνομα, ζητά επιβεβαίωση για το σταμάτημα όλων των bots."
    },
    {
      command: "/bot status [όνομα]",
      descriptionKey: "botStats",
      details: "Εμφανίζει αναλυτικές πληροφορίες για την κατάσταση του συγκεκριμένου bot ή όλων αν δεν δοθεί όνομα."
    },
    {
      command: "/maker start [όνομα]",
      descriptionKey: "makerBot.startBot",
      details: "Εκκινεί το maker bot με το συγκεκριμένο όνομα για δημιουργία ρευστότητας στην αγορά."
    },
    {
      command: "/maker stop [όνομα]",
      descriptionKey: "makerBot.stopBot",
      details: "Σταματά το maker bot με το συγκεκριμένο όνομα."
    },
    {
      command: "/bot create",
      descriptionKey: "Δημιουργία νέου bot",
      details: "Ανοίγει τον οδηγό δημιουργίας νέου bot με επιλογές στρατηγικών και παραμέτρων."
    },
  ],
  api: [
    {
      command: "/api list",
      descriptionKey: "apiVault.manageApiKeys",
      details: "Εμφανίζει λίστα με τα αποθηκευμένα API κλειδιά στην κλειδοθήκη."
    },
    {
      command: "/api add [υπηρεσία]",
      descriptionKey: "Προσθήκη API κλειδιού",
      details: "Ξεκινά τη διαδικασία προσθήκης νέου API κλειδιού για την επιλεγμένη υπηρεσία."
    },
    {
      command: "/api check [υπηρεσία]",
      descriptionKey: "Έλεγχος API κλειδιού",
      details: "Ελέγχει την εγκυρότητα και κατάσταση του API κλειδιού για την επιλεγμένη υπηρεσία."
    },
    {
      command: "/api export",
      descriptionKey: "Εξαγωγή κλειδιών",
      details: "Εξάγει τα κλειδιά σας σε κρυπτογραφημένο αρχείο για ασφαλή αποθήκευση."
    },
  ],
  system: [
    {
      command: "/help",
      descriptionKey: "help.availableCommands",
      details: "Εμφανίζει αυτή τη λίστα βοήθειας με όλες τις διαθέσιμες εντολές."
    },
    {
      command: "/backup create",
      descriptionKey: "Δημιουργία αντιγράφου ασφαλείας",
      details: "Δημιουργεί χειροκίνητα ένα αντίγραφο ασφαλείας της τρέχουσας κατάστασης της εφαρμογής."
    },
    {
      command: "/restore [σημείο]",
      descriptionKey: "Επαναφορά συστήματος",
      details: "Επαναφέρει το σύστημα σε προηγούμενο σημείο αντιγράφου ασφαλείας."
    },
    {
      command: "/health",
      descriptionKey: "Έλεγχος υγείας συστήματος",
      details: "Εκτελεί διαγνωστικό έλεγχο της κατάστασης του συστήματος και των συνδέσεων API."
    },
  ]
};

export function CommandList() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<keyof typeof COMMANDS_BY_CATEGORY>("wallet");
  
  const filteredCommands = searchTerm 
    ? Object.values(COMMANDS_BY_CATEGORY).flat().filter(cmd => 
        cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cmd.details.toLowerCase().includes(searchTerm.toLowerCase()))
    : COMMANDS_BY_CATEGORY[activeCategory];
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">{t("help.commandExplorer")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("help.exploreAllCommands")}
        </p>
        
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Αναζήτηση εντολών..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {searchTerm ? (
        <div className="space-y-2">
          <h4 className="font-medium text-sm mb-2">Αποτελέσματα αναζήτησης</h4>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <CommandItem key={index} command={cmd} t={t} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Δε βρέθηκαν εντολές που να ταιριάζουν με την αναζήτηση.</p>
          )}
        </div>
      ) : (
        <Tabs defaultValue="wallet" value={activeCategory} onValueChange={(value) => setActiveCategory(value as keyof typeof COMMANDS_BY_CATEGORY)}>
          <TabsList className="mb-4 grid grid-cols-4 w-full">
            <TabsTrigger value="wallet">Πορτοφόλι</TabsTrigger>
            <TabsTrigger value="bots">Bots</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="system">Σύστημα</TabsTrigger>
          </TabsList>
          
          {Object.entries(COMMANDS_BY_CATEGORY).map(([category, commands]) => (
            <TabsContent key={category} value={category} className="space-y-2">
              {commands.map((cmd, index) => (
                <CommandItem key={index} command={cmd} t={t} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

interface CommandItemProps {
  command: {
    command: string;
    descriptionKey: string;
    details: string;
  };
  t: (key: string) => string;
}

function CommandItem({ command, t }: CommandItemProps) {
  return (
    <div className="border rounded-md p-3 hover:bg-accent">
      <div className="flex justify-between items-center">
        <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
          {command.command}
        </code>
        <span className="text-xs text-muted-foreground">{t("general.command")}</span>
      </div>
      <p className="text-sm mt-1">
        {command.descriptionKey.includes('.') ? t(command.descriptionKey) : command.descriptionKey}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {command.details}
      </p>
    </div>
  );
}
