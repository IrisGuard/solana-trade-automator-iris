
import { heliusKeyManager } from "./HeliusKeyManager";
import { tokenService, TokenService } from "./TokenService";
import { transactionService, TransactionService } from "./TransactionService";
import { validationService, ValidationService } from "./ValidationService";
import { HELIUS_BASE_URL } from "./HeliusConfig";

/**
 * Main HeliusService class that coordinates all Helius API functionality
 * This class delegates specific functionality to specialized service classes
 * while maintaining backwards compatibility
 */
class HeliusService {
  private initialized = false;
  private baseUrl = HELIUS_BASE_URL;
  private tokenService: TokenService;
  private transactionService: TransactionService;
  private validationService: ValidationService;

  constructor() {
    this.tokenService = tokenService;
    this.transactionService = transactionService;
    this.validationService = validationService;
    this.initialize();
  }

  public async initialize(): Promise<void> {
    try {
      console.log("Αρχικοποίηση HeliusService...");
      this.initialized = true;
    } catch (error) {
      console.error("Σφάλμα κατά την αρχικοποίηση του HeliusService:", error);
    }
  }

  public async reinitialize(): Promise<void> {
    console.log("Επανεκκίνηση HeliusService...");
    this.initialized = false;
    await this.initialize();
  }

  // Token-related methods (delegated to TokenService)
  public async getTokenBalances(walletAddress: string) {
    return this.tokenService.getTokenBalances(walletAddress);
  }

  public async getTokenMetadata(tokenAddresses: string[]) {
    return this.tokenService.getTokenMetadata(tokenAddresses);
  }

  // Transaction-related methods (delegated to TransactionService)
  public async getTransactionHistory(walletAddress: string, limit: number = 10) {
    return this.transactionService.getTransactionHistory(walletAddress, limit);
  }

  // Validation-related methods (delegated to ValidationService)
  public async checkApiKey(apiKey: string): Promise<boolean> {
    return this.validationService.checkApiKey(apiKey);
  }
}

// Εξάγουμε ένα μοναδικό instance του HeliusService
export const heliusService = new HeliusService();

// Εξάγουμε την κλάση για χρήση σε άλλα αρχεία
export default HeliusService;

// Re-export types for backward compatibility using 'export type'
export type { Transaction, TokenBalance, TokenMetadata } from "./types";
