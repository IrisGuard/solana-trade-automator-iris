
export interface ErrorOptions {
  // Αναγνωριστικό για το σφάλμα
  id?: string;
  
  // Πηγή του σφάλματος (π.χ. 'network', 'api', 'ui')
  source?: string;
  
  // Προσαρμοσμένο μήνυμα
  message?: string;
  
  // Component που προκάλεσε το σφάλμα
  component?: string;
  
  // Εάν θα καταγραφεί στην κονσόλα
  logToConsole?: boolean;
  
  // Εάν θα εμφανιστεί στο UI
  showToast?: boolean;
  
  // Τίτλος για την ειδοποίηση toast
  title?: string;
  
  // Εάν το σφάλμα θα αποσταλεί στο συζήτηση
  sendToChat?: boolean;
  
  // Εάν το σφάλμα θα αποσταλεί στο UI
  sendToUI?: boolean;
  
  // Λεπτομέρειες για το σφάλμα
  details?: string;
  
  // Μεταδεδομένα σχετικά με το σφάλμα
  meta?: Record<string, any>;
}
