
import { toast } from 'sonner';
import { MOCK_PRICES } from './config';

export interface TokenPriceData {
  price: number;
  priceChange24h: number;
  lastUpdated: string;
}

type PriceCallback = (price: TokenPriceData) => void;
type Unsubscribe = () => void;

// Export the function for direct imports
export const fetchTokenPrices = async (tokenAddresses: string[]): Promise<Record<string, TokenPriceData>> => {
  try {
    const prices: Record<string, TokenPriceData> = {};
    
    for (const address of tokenAddresses) {
      prices[address] = {
        price: MOCK_PRICES[address] || Math.random() * 10,
        priceChange24h: (Math.random() * 10) - 5,
        lastUpdated: new Date().toISOString()
      };
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
};

// For παραγωγικό περιβάλλον θα χρησιμοποιούσαμε μια πραγματική υπηρεσία τιμών
class PriceService {
  private subscriptions: Map<string, Set<PriceCallback>> = new Map();
  private priceData: Map<string, TokenPriceData> = new Map();
  private updateInterval: number | null = null;

  constructor() {
    // Αρχικοποιήστε τις τιμές από το mock
    Object.entries(MOCK_PRICES).forEach(([tokenAddress, price]) => {
      this.priceData.set(tokenAddress, {
        price,
        priceChange24h: this.getRandomPriceChange(),
        lastUpdated: new Date().toISOString()
      });
    });
  }

  // Λήψη τιμής για ένα token
  async getTokenPrice(tokenAddress: string): Promise<TokenPriceData> {
    // Έλεγχος αν έχουμε ήδη τιμή
    if (this.priceData.has(tokenAddress)) {
      return this.priceData.get(tokenAddress)!;
    }

    // Αν δεν έχουμε τιμή, δημιουργούμε μια τυχαία τιμή
    const newPrice = {
      price: Math.random() * 10,
      priceChange24h: this.getRandomPriceChange(),
      lastUpdated: new Date().toISOString()
    };

    this.priceData.set(tokenAddress, newPrice);
    return newPrice;
  }

  // Εγγραφή για ενημερώσεις τιμών
  subscribeToPriceUpdates(tokenAddress: string, callback: PriceCallback): Unsubscribe {
    // Δημιουργία εγγραφής
    if (!this.subscriptions.has(tokenAddress)) {
      this.subscriptions.set(tokenAddress, new Set());
    }
    
    this.subscriptions.get(tokenAddress)!.add(callback);

    // Εκκίνηση ενημερώσεων αν δεν έχουν ξεκινήσει ήδη
    this.startUpdates();

    // Επιστροφή συνάρτησης για κατάργηση εγγραφής
    return () => {
      this.unsubscribe(tokenAddress, callback);
    };
  }

  // Κατάργηση εγγραφής από ενημερώσεις τιμών
  private unsubscribe(tokenAddress: string, callback: PriceCallback): void {
    const callbacks = this.subscriptions.get(tokenAddress);
    
    if (callbacks) {
      callbacks.delete(callback);
      
      // Αν δεν υπάρχουν άλλες εγγραφές για αυτό το token
      if (callbacks.size === 0) {
        this.subscriptions.delete(tokenAddress);
      }
      
      // Αν δεν υπάρχουν εγγραφές καθόλου, σταματάμε τις ενημερώσεις
      if (this.subscriptions.size === 0) {
        this.stopUpdates();
      }
    }
  }

  // Έναρξη περιοδικών ενημερώσεων
  private startUpdates(): void {
    if (!this.updateInterval) {
      this.updateInterval = window.setInterval(() => this.updatePrices(), 15000);
    }
  }

  // Διακοπή περιοδικών ενημερώσεων
  private stopUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Ενημέρωση τιμών
  private updatePrices(): void {
    for (const [tokenAddress, callbacks] of this.subscriptions.entries()) {
      // Λήψη τρέχουσας τιμής
      const currentPriceData = this.priceData.get(tokenAddress) || {
        price: 1,
        priceChange24h: 0,
        lastUpdated: new Date().toISOString()
      };

      // Δημιουργία νέας τιμής (με μικρή διακύμανση)
      const newPrice = currentPriceData.price * (1 + (Math.random() * 0.06 - 0.03));
      
      // Ενημέρωση τιμής
      const updatedPriceData = {
        price: newPrice,
        priceChange24h: this.calculateNewPriceChange(currentPriceData.priceChange24h),
        lastUpdated: new Date().toISOString()
      };
      
      this.priceData.set(tokenAddress, updatedPriceData);
      
      // Ενημέρωση συνδρομητών
      callbacks.forEach(callback => {
        try {
          callback(updatedPriceData);
        } catch (error) {
          console.error('Error in price update callback:', error);
        }
      });
    }
  }

  // Δημιουργία τυχαίας μεταβολής τιμής
  private getRandomPriceChange(): number {
    return (Math.random() * 10) - 5; // -5% έως +5% 
  }

  // Υπολογισμός νέας μεταβολής τιμής
  private calculateNewPriceChange(currentChange: number): number {
    // Προσθέτουμε μικρή τυχαία μεταβολή
    const newChange = currentChange + (Math.random() - 0.5);
    
    // Περιορισμός εντός εύλογων ορίων
    return Math.max(-15, Math.min(15, newChange));
  }
}

export const priceService = new PriceService();
