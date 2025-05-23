
export function useLanguage() {
  return {
    t: (key: string, fallback?: string) => fallback || key
  };
}
