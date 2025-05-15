
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useClipboard(timeout = 2000) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const copyToClipboard = useCallback((text: string, successMessage?: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedValue(text);
          setIsCopied(true);
          if (successMessage) toast.success(successMessage);
          
          setTimeout(() => {
            setIsCopied(false);
            setCopiedValue(null);
          }, timeout);
        })
        .catch(error => {
          console.error('Failed to copy:', error);
          toast.error('Failed to copy to clipboard');
        });
    } else {
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopiedValue(text);
          setIsCopied(true);
          if (successMessage) toast.success(successMessage);
          
          setTimeout(() => {
            setIsCopied(false);
            setCopiedValue(null);
          }, timeout);
        } else {
          toast.error('Failed to copy to clipboard');
        }
      } catch (err) {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy to clipboard');
      }
    }
  }, [timeout]);
  
  return { copiedValue, isCopied, copyToClipboard };
}
