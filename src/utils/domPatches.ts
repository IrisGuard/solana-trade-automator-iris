
/**
 * Patches για προβλήματα DOM που σχετίζονται με το React
 * Αντιμετωπίζει το issue #17256: NotFoundError: Αποτυχία εκτέλεσης του 'removeChild' στον 'Κόμβο'
 * https://github.com/facebook/react/issues/17256
 */

/**
 * Προσθέτει patch για να αποτρέψει σφάλματα σχετικά με το removeChild
 */
export function applyDOMPatches() {
  try {
    // Αποθήκευση της αρχικής μεθόδου removeChild
    const originalRemoveChild = Node.prototype.removeChild;
    
    // Αντικατάσταση της removeChild με ασφαλέστερη έκδοση
    Node.prototype.removeChild = function(child) {
      if (child && this.contains(child)) {
        return originalRemoveChild.call(this, child);
      } else {
        console.warn('Προσπάθεια αφαίρεσης μη υπάρχοντος παιδιού, αποφυγή σφάλματος', { 
          node: this, 
          child: child 
        });
        // Επιστροφή του child για να αποτρέψουμε περαιτέρω σφάλματα
        return child;
      }
    };
    
    console.log('Εφαρμόστηκαν patches για προβλήματα DOM (React issue #17256)');
  } catch (error) {
    console.error('Αποτυχία εφαρμογής DOM patches:', error);
  }
}

/**
 * Προσθέτει patch για να αποτρέψει σφάλματα σχετικά με το appendChild
 */
export function applyAppendChildPatch() {
  try {
    // Αποθήκευση της αρχικής μεθόδου appendChild
    const originalAppendChild = Node.prototype.appendChild;
    
    // Αντικατάσταση της appendChild με ασφαλέστερη έκδοση
    Node.prototype.appendChild = function(child) {
      try {
        return originalAppendChild.call(this, child);
      } catch (error) {
        console.warn('Προσπάθεια προσθήκης παιδιού απέτυχε, αποφυγή σφάλματος', { 
          node: this, 
          child: child,
          error: error
        });
        // Επιστροφή του child για να αποτρέψουμε περαιτέρω σφάλματα
        return child;
      }
    };
    
    console.log('Εφαρμόστηκε patch για το appendChild');
  } catch (error) {
    console.error('Αποτυχία εφαρμογής appendChild patch:', error);
  }
}

/**
 * Εφαρμόζει όλα τα patches DOM
 */
export function applyAllDOMPatches() {
  applyDOMPatches();
  applyAppendChildPatch();
}
