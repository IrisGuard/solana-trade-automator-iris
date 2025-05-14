
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Διορθώνουμε τα θέματα DOM patching

// Προσθήκη τύπων για το window object
declare global {
  interface Window {
    React: typeof React;
    ReactDOM: typeof ReactDOM;
  }
}

if (typeof window !== 'undefined') {
  // Εφαρμογή DOM patches
  try {
    // Βεβαιωνόμαστε ότι το ReactDOM είναι διαθέσιμο στο window
    window.ReactDOM = window.ReactDOM || { ...ReactDOM };
    
    // Βεβαιωνόμαστε ότι το React είναι επίσης διαθέσιμο
    window.React = window.React || { ...React };

    console.log('DOM patches applied successfully');
  } catch (error) {
    console.error('Error applying DOM patches:', error);
  }
}
