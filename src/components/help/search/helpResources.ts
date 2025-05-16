
import React from "react";
import { Wallet, Bot, Lock, Database, Settings, FileText, BookOpen } from "lucide-react";
import { ResourceLink } from "../solana/types";
import { helpResources } from "../solana/resources";
import { Shield, ArrowsUpDown } from "./icons";

// Expanded resources for the platform-specific help items
export const platformHelpResources = [
  {
    title: "Σύνδεση Πορτοφολιού Phantom",
    description: "Αναλυτικός οδηγός για τη σύνδεση του Phantom Wallet με την πλατφόρμα.",
    url: "/help#wallet-connection",
    category: "Πορτοφόλι",
    iconName: "Wallet"
  },
  {
    title: "Δημιουργία Trading Bot",
    description: "Βήμα προς βήμα οδηγίες για την δημιουργία και παραμετροποίηση ενός Trading Bot.",
    url: "/help#create-bot",
    category: "Bots",
    iconName: "Bot"
  },
  {
    title: "Διαχείριση API Κλειδιών",
    description: "Οδηγός για την ασφαλή αποθήκευση και διαχείριση των API κλειδιών στην κλειδοθήκη.",
    url: "/help#api-vault",
    category: "Ασφάλεια",
    iconName: "Lock"
  },
  {
    title: "Στρατηγικές Trading",
    description: "Αναλυτική παρουσίαση των διαθέσιμων στρατηγικών trading και πώς να τις βελτιστοποιήσετε.",
    url: "/help#trading-strategies",
    category: "Trading",
    iconName: "FileText"
  },
  {
    title: "Προστασία Συστήματος",
    description: "Πληροφορίες για τα συστήματα προστασίας και αυτόματης αποκατάστασης της εφαρμογής.",
    url: "/help#system-protection",
    category: "Ασφάλεια",
    iconName: "Shield"
  },
  {
    title: "Ρυθμίσεις Ασφαλείας Συναλλαγών",
    description: "Οδηγός για τη διαμόρφωση των ρυθμίσεων ασφαλείας των συναλλαγών σας.",
    url: "/help#transaction-security",
    category: "Ασφάλεια",
    iconName: "Settings"
  },
  {
    title: "Ανάλυση Δεδομένων & Αναφορές",
    description: "Πώς να χρησιμοποιήσετε τα εργαλεία ανάλυσης για τη βελτιστοποίηση των συναλλαγών σας.",
    url: "/help#data-analytics",
    category: "Analytics",
    iconName: "Database"
  },
  {
    title: "Ανταλλαγή Tokens (Swapping)",
    description: "Οδηγός για την ανταλλαγή tokens με τις καλύτερες τιμές μέσω του Jupiter Aggregator.",
    url: "/help#token-swapping",
    category: "Trading",
    iconName: "ArrowsUpDown"
  },
  {
    title: "Backtesting Στρατηγικών",
    description: "Πώς να χρησιμοποιήσετε το εργαλείο backtesting για τη δοκιμή των στρατηγικών σας.",
    url: "/help#backtesting",
    category: "Analytics",
    iconName: "BookOpen"
  },
];

// Combine the resources
export const allResources = [...helpResources, ...platformHelpResources];
