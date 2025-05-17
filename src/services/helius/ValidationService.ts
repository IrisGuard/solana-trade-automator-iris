
import { HELIUS_API_BASE_URL } from "./HeliusConfig";

/**
 * Service for validation and utility operations
 */
export class ValidationService {
  /**
   * Check if an API key is valid
   */
  public async checkApiKey(apiKey: string): Promise<boolean> {
    try {
      // Δοκιμάζουμε να κάνουμε ένα απλό αίτημα για να ελέγξουμε αν το κλειδί API είναι έγκυρο
      const url = new URL(`${HELIUS_API_BASE_URL}/health-check`);
      url.searchParams.append('api-key', apiKey);
      
      const response = await fetch(url.toString());
      return response.ok;
    } catch (error) {
      console.error("Σφάλμα κατά τον έλεγχο του κλειδιού API:", error);
      return false;
    }
  }
}

// Export a singleton instance
export const validationService = new ValidationService();
