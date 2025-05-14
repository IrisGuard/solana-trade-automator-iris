
import { useEffect } from 'react';

/**
 * Hook για χειρισμό του πλήκτρου Escape
 */
export function useEscapeKeyHandler(
  autoClose: boolean, 
  onClose: () => void
): void {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && autoClose) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, autoClose]);
}
