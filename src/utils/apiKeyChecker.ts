
/**
 * Tests if an API key is valid for a specific service
 * @param service The service name (e.g., 'helius', 'solscan')
 * @param apiKey The API key to test
 * @returns Promise resolving to true if the key is valid
 */
export async function testApiKey(service: string, apiKey: string): Promise<boolean> {
  if (!apiKey || apiKey.trim() === '') {
    return false;
  }
  
  try {
    let testUrl: string;
    let options: RequestInit = {
      method: 'GET',
      headers: {}
    };
    
    // Configure test endpoint based on service
    switch (service) {
      case 'helius':
        testUrl = `https://api.helius.xyz/v0/addresses/vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg/balances?api-key=${apiKey}`;
        break;
        
      case 'solscan':
        testUrl = 'https://public-api.solscan.io/token/meta?tokenAddress=So11111111111111111111111111111111111111112';
        options.headers = { 'x-api-key': apiKey };
        break;
        
      case 'birdeye':
        testUrl = 'https://public-api.birdeye.so/public/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=10';
        options.headers = { 'x-api-key': apiKey };
        break;
        
      case 'jupiter':
        testUrl = 'https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=10000000&slippage=0.5';
        break;
        
      case 'coingecko':
        testUrl = `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&x_cg_api_key=${apiKey}`;
        break;
        
      case 'cryptocompare':
        testUrl = `https://min-api.cryptocompare.com/data/price?fsym=SOL&tsyms=USD&api_key=${apiKey}`;
        break;
        
      default:
        // For unknown services, just check if the key is at least 10 chars long
        return apiKey.length >= 10;
    }
    
    // Make test request
    const response = await fetch(testUrl, options);
    
    // Key is valid if response is successful
    return response.status === 200;
  } catch (error) {
    console.error(`Error testing ${service} API key:`, error);
    return false;
  }
}
