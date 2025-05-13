
import React from "react";

// Λίστα με εντολές και την περιγραφή τους
const COMMANDS = [
  {
    command: "/connect",
    description: "Συνδέει το Solana πορτοφόλι σας με την εφαρμογή",
  },
  {
    command: "/disconnect",
    description: "Αποσυνδέει το συνδεδεμένο πορτοφόλι",
  },
  {
    command: "/balance",
    description: "Εμφανίζει το υπόλοιπο του πορτοφολιού σας",
  },
  {
    command: "/tokens",
    description: "Εμφανίζει τη λίστα με τα tokens που διαθέτετε",
  },
  {
    command: "/swap [ποσό] [από] [προς]",
    description: "Ανταλλάσσει tokens (π.χ. /swap 10 SOL USDC)",
  },
  {
    command: "/bot start",
    description: "Ξεκινάει το trading bot",
  },
  {
    command: "/bot stop",
    description: "Σταματάει το trading bot",
  },
  {
    command: "/bot status",
    description: "Εμφανίζει την κατάσταση του bot",
  },
  {
    command: "/maker start",
    description: "Ξεκινάει το maker bot",
  },
  {
    command: "/maker stop",
    description: "Σταματάει το maker bot",
  },
  {
    command: "/api list",
    description: "Εμφανίζει τα διαθέσιμα API keys",
  },
  {
    command: "/help",
    description: "Εμφανίζει αυτή τη λίστα βοήθειας",
  }
];

export function CommandList() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Διαθέσιμες Εντολές</h3>
        <p className="text-sm text-muted-foreground">
          Χρησιμοποιήστε αυτές τις εντολές για γρήγορη πρόσβαση στη λειτουργικότητα
        </p>
      </div>
      
      <div className="space-y-2">
        {COMMANDS.map((cmd, index) => (
          <div key={index} className="border rounded-md p-3 hover:bg-accent">
            <div className="flex justify-between items-center">
              <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                {cmd.command}
              </code>
              <span className="text-xs text-muted-foreground">Εντολή</span>
            </div>
            <p className="text-sm mt-1">{cmd.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
