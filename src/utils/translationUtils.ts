
/**
 * Utility functions for handling translations
 */

/**
 * Safely get a translation key or fallback to default text
 * @param t The translation function
 * @param key The translation key
 * @param defaultText Default text to use if translation is not found
 */
export function safeTranslate(t: (key: string) => string, key: string): string {
  const translation = t(key);
  return translation === key ? key : translation; // If key is returned unchanged, use key as fallback
}
