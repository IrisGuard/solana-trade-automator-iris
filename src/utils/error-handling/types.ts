
/**
 * Επιλογές για την εμφάνιση σφαλμάτων
 */
export interface ErrorOptions {
  /** Εμφάνιση toast μηνύματος */
  showToast?: boolean;
  /** Καταγραφή στην κονσόλα */
  logToConsole?: boolean;
  /** Αποστολή στο chat */
  sendToChat?: boolean;
  /** Χρήση του error collector */
  useCollector?: boolean;
  /** Τίτλος του σφάλματος */
  title?: string;
  /** Συστατικό που προκάλεσε το σφάλμα */
  component?: string;
  /** Επιπλέον λεπτομέρειες */
  details?: any;
  /** Προέλευση σφάλματος (client/server) */
  source?: string;
}

export { ErrorOptions as ErrorDisplayOptions };
