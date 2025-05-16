
import { Connection, clusterApiUrl } from '@solana/web3.js';

// Default to devnet for safety
const network = 'devnet';
export const endpoint = clusterApiUrl(network);
export const connection = new Connection(endpoint, 'confirmed');

export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
