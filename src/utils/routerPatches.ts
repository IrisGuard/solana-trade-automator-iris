
import * as React from 'react';

// Βεβαιώνουμε ότι τα βασικά React hooks είναι διαθέσιμα για το react-router-dom
// χωρίς να εξαρτώνται από την εισαγωγή τους από άλλα modules

// Προσθήκη τύπων για το window object
declare global {
  interface Window {
    React: typeof React;
  }
}

if (typeof window !== 'undefined') {
  // Κάνουμε τα core React hooks και μεθόδους διαθέσιμα παγκοσμίως για να διορθώσουμε προβλήματα με το React Router DOM
  try {
    // Δημιουργία πλήρους αντιγράφου του React στο window για να αποφύγουμε το σφάλμα TS2740
    window.React = { ...React };
    
    // Πρόσθεση debugger πληροφορίας
    console.log('React Router patches applied successfully - React version:', React.version);
  } catch (error) {
    console.error('Error applying React Router patches:', error);
  }
}

// Εξαγωγή βοηθητικής συνάρτησης για να ελέγξουμε αν το παράθυρο έχει React
export function checkReactPatch() {
  if (typeof window !== 'undefined') {
    return !!window.React && !!window.React.createElement;
  }
  return false;
}
