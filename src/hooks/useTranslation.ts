
// Simple translation hook
export function useTranslation() {
  const translate = (key: string, defaultValue: string): string => {
    return defaultValue;
  };
  
  return {
    t: translate
  };
}
