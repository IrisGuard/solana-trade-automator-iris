
/**
 * Utility functions for handling translations
 */

/**
 * Safely get a translation key or fallback to default text
 * @param t The translation function
 * @param key The translation key
 * @param defaultText Default text to use if translation is not found
 */
export function safeTranslate(t: (key: string, fallback?: string) => string, key: string, defaultText?: string): string {
  return t(key, defaultText);
}

/**
 * Utility function to make translation access more convenient
 * It deals with possibly undefined translation functions
 */
export function translateWithDefault(translationFunc: ((key: string, fallback?: string) => string) | undefined, key: string, defaultText: string): string {
  if (typeof translationFunc === 'function') {
    return translationFunc(key, defaultText);
  }
  return defaultText;
}
