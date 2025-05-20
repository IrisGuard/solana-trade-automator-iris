
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
