
import React, { useState, useMemo } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ResourceLink, ResourceCategory } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search, Copy, Check } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { toast } from "sonner";

// Δεδομένα εντολών και πόρων Solana
const SOLANA_RESOURCES: ResourceLink[] = [
  // Επίσημοι οδηγοί Solana
  {
    url: "https://docs.solana.com/introduction",
    title: "Εισαγωγή στο Solana",
    description: "Επίσημος οδηγός εισαγωγής στο οικοσύστημα Solana",
    category: "guides"
  },
  {
    url: "https://docs.solana.com/cluster/overview",
    title: "Αρχιτεκτονική Cluster",
    description: "Επισκόπηση της αρχιτεκτονικής Solana cluster",
    category: "guides"
  },
  {
    url: "https://docs.solana.com/developing/programming-model/overview",
    title: "Μοντέλο Προγραμματισμού",
    description: "Κατανόηση του μοντέλου προγραμματισμού του Solana",
    category: "guides"
  },
  {
    url: "https://docs.solana.com/economics_overview",
    title: "Οικονομικά του Solana",
    description: "Ανάλυση των οικονομικών μηχανισμών του Solana",
    category: "guides"
  },
  
  // Εργαλεία Ανάπτυξης
  {
    url: "https://solanacookbook.com",
    title: "Solana Cookbook",
    description: "Συλλογή χρήσιμων παραδειγμάτων και οδηγών για ανάπτυξη στο Solana",
    category: "tools"
  },
  {
    url: "https://github.com/solana-labs/solana-web3.js",
    title: "Solana Web3.js",
    description: "Επίσημη JavaScript βιβλιοθήκη για αλληλεπίδραση με το Solana blockchain",
    category: "tools"
  },
  {
    url: "https://spl.solana.com/token",
    title: "SPL Token Program",
    description: "Προγράμματα για δημιουργία και διαχείριση tokens στο Solana",
    category: "tools"
  },
  {
    url: "https://explorer.solana.com",
    title: "Solana Explorer",
    description: "Εργαλείο για εξερεύνηση συναλλαγών και λογαριασμών στο Solana blockchain",
    category: "tools"
  },
  {
    url: "https://helius.dev",
    title: "Helius API",
    description: "Προηγμένο API για πρόσβαση σε δεδομένα του Solana blockchain",
    category: "tools"
  },
  
  // Πλατφόρμα Commands
  {
    url: "#",
    title: "/connect",
    description: "Σύνδεση του πορτοφολιού Solana",
    category: "commands"
  },
  {
    url: "#",
    title: "/disconnect",
    description: "Αποσύνδεση του πορτοφολιού Solana",
    category: "commands"
  },
  {
    url: "#",
    title: "/balance",
    description: "Εμφάνιση του υπολοίπου SOL",
    category: "commands"
  },
  {
    url: "#",
    title: "/tokens",
    description: "Λίστα όλων των tokens στο πορτοφόλι",
    category: "commands"
  },
  {
    url: "#",
    title: "/swap [ποσό] [από] [προς]",
    description: "Ανταλλαγή tokens (π.χ. /swap 10 SOL USDC)",
    category: "commands"
  },
  {
    url: "#",
    title: "/bot start",
    description: "Εκκίνηση του trading bot",
    category: "commands"
  },
  {
    url: "#",
    title: "/bot stop",
    description: "Τερματισμός του trading bot",
    category: "commands"
  },
  {
    url: "#",
    title: "/bot status",
    description: "Εμφάνιση κατάστασης του bot",
    category: "commands"
  },
  {
    url: "#",
    title: "/maker start",
    description: "Εκκίνηση του market maker bot",
    category: "commands"
  },
  {
    url: "#",
    title: "/maker stop",
    description: "Τερματισμός του market maker bot",
    category: "commands"
  },
  {
    url: "#",
    title: "/api list",
    description: "Προβολή διαθέσιμων API keys",
    category: "commands"
  },
  {
    url: "#",
    title: "/help",
    description: "Εμφάνιση βοήθειας και διαθέσιμων εντολών",
    category: "commands"
  },
  
  // Ασφάλεια και Επιβεβαιώσεις
  {
    url: "#",
    title: "/security status",
    description: "Έλεγχος κατάστασης ασφαλείας του λογαριασμού",
    category: "security"
  },
  {
    url: "#",
    title: "/security enable [feature]",
    description: "Ενεργοποίηση συγκεκριμένου χαρακτηριστικού ασφαλείας",
    category: "security"
  },
  {
    url: "#",
    title: "/security disable [feature]",
    description: "Απενεργοποίηση συγκεκριμένου χαρακτηριστικού ασφαλείας",
    category: "security"
  },
  {
    url: "#",
    title: "/confirm [txid]",
    description: "Επιβεβαίωση συναλλαγής με συγκεκριμένο ID",
    category: "security"
  },
  {
    url: "#",
    title: "/approve [address] [description]",
    description: "Προσθήκη διεύθυνσης στη λίστα εγκεκριμένων",
    category: "security"
  },
  
  // Διαχείριση Δεδομένων
  {
    url: "#",
    title: "/export [data]",
    description: "Εξαγωγή δεδομένων (π.χ. keys, addresses, stats)",
    category: "data"
  },
  {
    url: "#",
    title: "/import [data]",
    description: "Εισαγωγή δεδομένων από αρχείο",
    category: "data"
  },
  {
    url: "#",
    title: "/backup",
    description: "Δημιουργία αντιγράφου ασφαλείας ρυθμίσεων",
    category: "data"
  },
  {
    url: "#",
    title: "/restore [backup]",
    description: "Επαναφορά ρυθμίσεων από αντίγραφο ασφαλείας",
    category: "data"
  }
];

// Κατηγορίες πόρων
const RESOURCE_CATEGORIES: ResourceCategory[] = [
  { id: "commands", name: "Εντολές Πλατφόρμας" },
  { id: "security", name: "Ασφάλεια & Επιβεβαιώσεις" },
  { id: "tools", name: "Εργαλεία Ανάπτυξης" },
  { id: "guides", name: "Οδηγοί & Τεκμηρίωση" },
  { id: "data", name: "Διαχείριση Δεδομένων" }
];

export function SolanaResourceExplorer() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("commands");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  
  // Φιλτράρισμα πόρων με βάση την αναζήτηση και την ενεργή κατηγορία
  const filteredResources = useMemo(() => {
    return SOLANA_RESOURCES.filter(resource => {
      const matchesSearch = 
        searchTerm === "" || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        activeCategory === "all" || 
        resource.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);
  
  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    toast.success(`Η εντολή "${command}" αντιγράφηκε στο πρόχειρο`);
    
    setTimeout(() => {
      setCopiedCommand(null);
    }, 2000);
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>{t("help.commandExplorer", "Εντολές & Πόροι Πλατφόρμας")}</CardTitle>
        <CardDescription>
          {t("help.exploreAllCommands", "Εξερευνήστε όλες τις διαθέσιμες εντολές και πόρους της πλατφόρμας")}
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Αναζήτηση εντολών και πόρων..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="commands" className="space-y-4" onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {RESOURCE_CATEGORIES.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {RESOURCE_CATEGORIES.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col space-y-2 rounded-lg border p-4 transition-all hover:bg-accent/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {resource.title}
                        </h3>
                        <Badge variant="outline">
                          {resource.category === "commands" ? "Εντολή" : 
                           resource.category === "security" ? "Ασφάλεια" : 
                           resource.category === "tools" ? "Εργαλείο" :
                           resource.category === "guides" ? "Οδηγός" : "Δεδομένα"}
                        </Badge>
                      </div>
                      
                      {resource.category === "commands" || resource.category === "security" ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleCopyCommand(resource.title)}
                        >
                          {copiedCommand === resource.title ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      ) : resource.url !== "#" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : null}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">Δεν βρέθηκαν αποτελέσματα για "{searchTerm}"</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => setSearchTerm("")}
                  >
                    Καθαρισμός αναζήτησης
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
