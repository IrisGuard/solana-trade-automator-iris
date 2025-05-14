
import { Connection } from "@solana/web3.js";
import type { Transaction } from "@/types/transaction";
import { parseTransactions } from "./parseTransaction";

export class TransactionService {
  /**
   * Λήψη συναλλαγών για μια διεύθυνση πορτοφολιού
   */
  static async getTransactions(address: string): Promise<Transaction[]> {
    try {
      // Απλοποιημένη υλοποίηση προς το παρόν
      // Σε μια πραγματική εφαρμογή, θα φέρναμε πραγματικές συναλλαγές από το blockchain
      const mockTransactions = [
        { 
          id: "tx1",
          signature: "signature1",
          blockTime: new Date(),
          timestamp: new Date().getTime(),
          status: "success",
          amount: "1.5",
          type: "transfer",
          // Αντικατάσταση των source/destination με συμβατά πεδία
          wallet_address: address,
        },
        { 
          id: "tx2",
          signature: "signature2",
          blockTime: new Date(),
          timestamp: new Date().getTime(),
          status: "success",
          amount: "0.5",
          type: "swap",
          wallet_address: address,
        }
      ] as unknown as Transaction[];

      return mockTransactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }
}
