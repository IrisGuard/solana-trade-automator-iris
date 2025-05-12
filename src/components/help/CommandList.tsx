
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CommandCategory {
  title: string;
  commands: {
    name: string;
    description: string;
    example?: string;
  }[];
}

export function CommandList() {
  const commandCategories: CommandCategory[] = [
    {
      title: "Σύνδεση και Πορτοφόλι",
      commands: [
        {
          name: "Σύνδεση Πορτοφολιού",
          description: "Συνδέστε το πορτοφόλι Phantom για να αποκτήσετε πρόσβαση σε όλες τις λειτουργίες της πλατφόρμας.",
          example: "Πατήστε το κουμπί 'Σύνδεση Πορτοφολιού' στην επάνω δεξιά γωνία."
        },
        {
          name: "Προβολή Υπολοίπου",
          description: "Δείτε το υπόλοιπο του SOL και άλλων tokens στο πορτοφόλι σας."
        },
        {
          name: "Αποσύνδεση Πορτοφολιού",
          description: "Αποσυνδέστε το πορτοφόλι σας από την πλατφόρμα για λόγους ασφαλείας όταν έχετε τελειώσει."
        }
      ]
    },
    {
      title: "API Vault",
      commands: [
        {
          name: "Προσθήκη API Key",
          description: "Προσθέστε νέα κλειδιά API στο vault για ασφαλή αποθήκευση και χρήση."
        },
        {
          name: "Κρυπτογράφηση Δεδομένων",
          description: "Τα ευαίσθητα δεδομένα κρυπτογραφούνται πριν αποθηκευτούν για μέγιστη ασφάλεια."
        },
        {
          name: "Εξαγωγή Κλειδιών",
          description: "Εξαγωγή των αποθηκευμένων κλειδιών σε ασφαλές αρχείο."
        },
        {
          name: "Προβολή Στατιστικών",
          description: "Προβολή στατιστικών για τα αποθηκευμένα κλειδιά ανά υπηρεσία και κατάσταση."
        }
      ]
    },
    {
      title: "Trading Bot",
      commands: [
        {
          name: "Ρύθμιση Bot",
          description: "Ρυθμίστε τις παραμέτρους του trading bot όπως ποσά, ζεύγη συναλλαγών και στρατηγική."
        },
        {
          name: "Ενεργοποίηση Bot",
          description: "Ξεκινήστε τη λειτουργία του bot για αυτοματοποιημένες συναλλαγές."
        },
        {
          name: "Παύση Bot",
          description: "Σταματήστε προσωρινά τη λειτουργία του bot χωρίς να χαθούν οι ρυθμίσεις."
        },
        {
          name: "Προσομοίωση",
          description: "Δοκιμάστε τη στρατηγική του bot χωρίς να χρησιμοποιήσετε πραγματικά κεφάλαια."
        }
      ]
    },
    {
      title: "Συναλλαγές",
      commands: [
        {
          name: "Προβολή Ιστορικού",
          description: "Δείτε το ιστορικό συναλλαγών του πορτοφολιού σας."
        },
        {
          name: "Φιλτράρισμα Συναλλαγών",
          description: "Φιλτράρετε τις συναλλαγές με βάση διάφορα κριτήρια όπως ημερομηνία, τύπος, κλπ."
        }
      ]
    },
    {
      title: "Ασφάλεια",
      commands: [
        {
          name: "Two-Factor Authentication",
          description: "Ενεργοποιήστε το 2FA για επιπλέον ασφάλεια στον λογαριασμό σας."
        },
        {
          name: "Ρυθμίσεις Ασφάλειας Συναλλαγών",
          description: "Ρυθμίστε παραμέτρους ασφαλείας για τις συναλλαγές, όπως όρια, καθυστερήσεις και γεωγραφικούς περιορισμούς."
        },
        {
          name: "Διαχείριση Συνεδριών",
          description: "Προβολή και διαχείριση των ενεργών συνεδριών σύνδεσης."
        }
      ]
    }
  ];

  return (
    <div className="p-4">
      <Accordion type="single" collapsible className="w-full">
        {commandCategories.map((category, idx) => (
          <AccordionItem key={idx} value={`category-${idx}`}>
            <AccordionTrigger className="font-medium">{category.title}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pl-2">
                {category.commands.map((command, cmdIdx) => (
                  <div key={cmdIdx} className="space-y-1">
                    <h4 className="text-sm font-medium">{command.name}</h4>
                    <p className="text-sm text-muted-foreground">{command.description}</p>
                    {command.example && (
                      <p className="text-xs text-muted-foreground italic mt-1">Παράδειγμα: {command.example}</p>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
