
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

const commands = [
  {
    category: "Γενικές Εντολές",
    items: [
      { command: "/help", description: "Εμφάνιση διαθέσιμων εντολών και βοήθειας" },
      { command: "/connect", description: "Σύνδεση με το Phantom Wallet" },
      { command: "/disconnect", description: "Αποσύνδεση από το Phantom Wallet" },
      { command: "/balance", description: "Έλεγχος υπολοίπου πορτοφολιού" }
    ]
  },
  {
    category: "Trading Bot",
    items: [
      { command: "/start-bot", description: "Εκκίνηση του trading bot" },
      { command: "/stop-bot", description: "Σταμάτημα του trading bot" },
      { command: "/status", description: "Έλεγχος κατάστασης του bot" },
      { command: "/settings", description: "Προβολή και αλλαγή ρυθμίσεων του bot" }
    ]
  },
  {
    category: "Συναλλαγές",
    items: [
      { command: "/buy [ποσό]", description: "Αγορά token με το συγκεκριμένο ποσό" },
      { command: "/sell [ποσό]", description: "Πώληση token με το συγκεκριμένο ποσό" },
      { command: "/history", description: "Προβολή ιστορικού συναλλαγών" }
    ]
  },
  {
    category: "Ανάλυση",
    items: [
      { command: "/price [token]", description: "Έλεγχος τρέχουσας τιμής του token" },
      { command: "/chart [token]", description: "Προβολή γραφήματος για το token" },
      { command: "/trend [token]", description: "Ανάλυση τάσης για το συγκεκριμένο token" }
    ]
  }
];

export function CommandList() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Search className="h-4 w-4" />
          <span>Λίστα διαθέσιμων εντολών</span>
        </div>
        
        {commands.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h3 className="font-medium mb-2">{category.category}</h3>
            <div className="space-y-1">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="grid grid-cols-3 text-sm py-1">
                  <div className="font-mono bg-muted px-2 py-1 rounded">
                    {item.command}
                  </div>
                  <div className="col-span-2 py-1 pl-2">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
            {categoryIndex < commands.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
