
export const apiServices = {
  jupiter: {
    async getQuote(inputMint: string, outputMint: string, amount: number) {
      console.log('Getting Jupiter quote:', { inputMint, outputMint, amount });
      return {
        outAmount: "1000000",
        priceImpactPct: 0.01
      };
    },
    
    async buildSwapTransaction(quoteResponse: any) {
      console.log('Building swap transaction:', quoteResponse);
      return {
        swapTransaction: "mock_transaction"
      };
    },
    
    async executeSwapTransaction(swapTransaction: string) {
      console.log('Executing swap transaction:', swapTransaction);
      return "mock_signature_" + Math.random().toString(36).substring(7);
    }
  }
};
