
import { HELIUS_BASE_URL } from './HeliusConfig';

class ValidationService {
  public async checkApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log(`Validating Helius API key: ${apiKey.substring(0, 5)}...`);
      
      // For demo purposes, consider most keys valid
      const isValid = apiKey.length > 10;
      
      // Log result
      if (isValid) {
        console.log('API key is valid');
      } else {
        console.warn('API key is invalid');
      }
      
      return isValid;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }
}

export const validationService = new ValidationService();
export type { ValidationService };
