
export const COMMANDS_BY_CATEGORY = {
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
