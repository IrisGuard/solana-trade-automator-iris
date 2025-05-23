
// Simple translation hook
export function useTranslation() {
  // This function now accepts both formats:
  // t(key) or t(key, defaultValue)
  const translate = (key: string, defaultValue?: string): string => {
    return defaultValue || key;
  };
  
  return {
    t: translate
  };
}
