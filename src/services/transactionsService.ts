
interface Transaction {
  user_id: string | null;
  wallet_address: string;
  signature: string;
  type: string;
  status: string;
  amount: string;
  source: string;
  destination: string;
}

export const transactionsService = {
  async saveTransaction(transaction: Transaction) {
    console.log('Saving transaction:', transaction);
    // This would normally save to Supabase
    return Promise.resolve();
  },

  async getTransactionsByWallet(walletAddress: string) {
    console.log('Getting transactions for wallet:', walletAddress);
    // Mock transactions
    return Promise.resolve([
      {
        id: '1',
        signature: 'mock_signature_1',
        type: 'swap',
        status: 'confirmed',
        amount: '100',
        timestamp: new Date().toISOString()
      }
    ]);
  }
};
