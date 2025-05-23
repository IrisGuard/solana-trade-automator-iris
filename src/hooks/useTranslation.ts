
export function useTranslation() {
  return {
    t: (key: string, fallback?: string) => fallback || key
  };
}
