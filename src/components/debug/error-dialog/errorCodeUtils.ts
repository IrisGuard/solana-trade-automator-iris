
/**
 * Δημιουργεί έναν μοναδικό κωδικό σφάλματος
 */
export function generateErrorCode(): string {
  return `ERROR-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
}
