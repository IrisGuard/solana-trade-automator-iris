
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { RPC_ENDPOINTS } from '@/utils/error-handling/constants';
import { tokenService } from './token';

export class SolanaService {
  private _connection: Connection;
  private _rpcUrl: string;
  
  constructor() {
    this._rpcUrl = RPC_ENDPOINTS.MAINNET;
    this._connection = new Connection(this._rpcUrl);
  }
  
  async fetchSOLBalance(address: string): Promise<number> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this._connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      return 0;
    }
  }
  
  async fetchAllTokenBalances(address: string) {
    return tokenService.fetchTokens(address);
  }
  
  async fetchTokenPrices(tokenAddress: string) {
    const addresses = Array.isArray(tokenAddress) ? tokenAddress : [tokenAddress];
    return tokenService.fetchTokenPrices(addresses)[tokenAddress];
  }
}

export const solanaService = new SolanaService();
