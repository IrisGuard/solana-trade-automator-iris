
import React from 'react';

export function ErrorTestPanelFooter() {
  return (
    <div className="mt-4 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Χρησιμοποιήστε αυτό το panel για να δοκιμάσετε την καταγραφή και εμφάνιση σφαλμάτων. 
        Τα σφάλματα θα εμφανιστούν ως toast μηνύματα, στην κονσόλα του περιηγητή 
        και θα αποσταλούν στο chat για ανάλυση.
      </p>
    </div>
  );
}
