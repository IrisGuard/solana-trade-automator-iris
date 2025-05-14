
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { errorCollector } from '@/utils/error-handling/collector';
import { RPC_ENDPOINT } from '../config';
import { Token } from '@/types/wallet';

// Cache token accounts to avoid repeated RPC calls
const tokenAccountsCache = new Map<string, Token[]>();
const cacheTTL = 10 * 60 * 1000; // 10 minutes in milliseconds
const cacheTimestamps = new Map<string, number>();

/**
 * Get all token accounts for the specified wallet
 */
export async function getTokenAccounts(walletAddress: string): Promise<Token[]> {
    try {
        // Check cache first
        const cacheKey = `tokens_${walletAddress}`;
        const cachedData = tokenAccountsCache.get(cacheKey);
        const cacheTimestamp = cacheTimestamps.get(cacheKey) || 0;
        
        // Return cached data if valid
        if (cachedData && (Date.now() - cacheTimestamp < cacheTTL)) {
            console.log(`Using cached token accounts for ${walletAddress}`);
            return cachedData;
        }
        
        // Create connection
        const connection = new Connection(RPC_ENDPOINT);
        const pubkey = new PublicKey(walletAddress);
        
        // Get all token accounts owned by the wallet
        const tokenResp = await connection.getParsedTokenAccountsByOwner(
            pubkey,
            { programId: TOKEN_PROGRAM_ID },
            'confirmed'
        );
        
        // Transform to the Token interface
        const tokens: Token[] = tokenResp.value
            .filter(item => {
                const amount = Number(item.account.data.parsed.info.tokenAmount.amount);
                const decimals = item.account.data.parsed.info.tokenAmount.decimals;
                return amount > 0;
            })
            .map(item => {
                const accountData = item.account.data.parsed.info;
                const mintAddress = accountData.mint;
                const amount = Number(accountData.tokenAmount.amount);
                const decimals = accountData.tokenAmount.decimals;
                const uiAmount = amount / Math.pow(10, decimals);
                
                return {
                    mint: mintAddress,
                    address: item.pubkey.toString(),
                    amount: uiAmount,
                    decimals: decimals,
                    uiAmount: uiAmount.toString()
                };
            });
        
        // Update cache
        tokenAccountsCache.set(cacheKey, tokens);
        cacheTimestamps.set(cacheKey, Date.now());
        
        return tokens;
    } catch (error) {
        errorCollector.captureError(error as Error, {
            component: 'tokenAccounts',
            method: 'getTokenAccounts',
            details: { walletAddress },
            source: 'client'
        });
        console.error('Error fetching token accounts:', error);
        return [];
    }
}

/**
 * Clear the token accounts cache for a specific wallet or all wallets
 */
export function clearTokenAccountsCache(walletAddress?: string): void {
    if (walletAddress) {
        const cacheKey = `tokens_${walletAddress}`;
        tokenAccountsCache.delete(cacheKey);
        cacheTimestamps.delete(cacheKey);
        console.log(`Cleared token accounts cache for ${walletAddress}`);
    } else {
        tokenAccountsCache.clear();
        cacheTimestamps.clear();
        console.log('Cleared all token accounts cache');
    }
}
