
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useClipboard(timeout: number = 2000) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, successMessage: string = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(text);
      toast.success(successMessage);
      
      // Clear the copied state after the timeout
      setTimeout(() => {
        setCopiedValue(null);
      }, timeout);
      
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
      return false;
    }
  }, [timeout]);

  return {
    copiedValue,
    copyToClipboard,
    isCopied: (value: string) => copiedValue === value
  };
}
