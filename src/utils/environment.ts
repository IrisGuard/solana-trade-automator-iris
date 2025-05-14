
/**
 * Βοηθητικές συναρτήσεις για τον έλεγχο του περιβάλλοντος λειτουργίας της εφαρμογής
 */

// Προσδιορισμός αν η εφαρμογή τρέχει σε περιβάλλον ανάπτυξης
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
};

// Προσδιορισμός αν η εφαρμογή τρέχει στο production
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

// Έλεγχος αν η εφαρμογή τρέχει στο lovable.app domain
export const isLovableDomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('lovable.app');
};

// Λήψη του βασικού URL της εφαρμογής
export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return `${window.location.protocol}//${window.location.host}`;
};
