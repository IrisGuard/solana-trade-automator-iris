
import { errorCollector } from '@/utils/error-handling/collector';

interface TransactionData {
  signature: string;
  blockTime: number; // Timestamps are numbers in Unix time
  type: string;
  status: string;
  amount: string; // Amount as string for precision
  source?: string;
  destination?: string;
}

export function parseSimpleTransaction(txData: any): TransactionData {
  try {
    return {
      signature: txData.signature || '',
      blockTime: txData.blockTime ? new Date(txData.blockTime).getTime() : Date.now(), // Convert Date to timestamp number
      type: txData.type || 'unknown',
      status: txData.status || 'confirmed',
      amount: String(txData.amount || 0), // Convert to string
      source: txData.source,
      destination: txData.destination
    };
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error('Error parsing simple transaction'), {
      component: 'parseTransaction',
      source: 'client'
    });
    
    // Return default transaction data on error
    return {
      signature: 'error',
      blockTime: Date.now(), // Current timestamp as number
      type: 'error',
      status: 'error',
      amount: String(0), // Zero as string
      source: undefined,
      destination: undefined
    };
  }
}

export function parseHeliusTransaction(txData: any): TransactionData {
  try {
    return {
      signature: txData.signature || txData.id || '',
      blockTime: txData.timestamp ? new Date(txData.timestamp).getTime() : Date.now(), // Convert Date to timestamp number
      type: txData.type || 'unknown',
      status: txData.status || 'confirmed',
      amount: String(txData.amount || 0), // Convert to string
      source: txData.source || txData.sourceAddress,
      destination: txData.destination || txData.destinationAddress
    };
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error('Error parsing Helius transaction'), {
      component: 'parseTransaction',
      source: 'client'
    });
    
    // Return default transaction data on error
    return {
      signature: 'error',
      blockTime: Date.now(), // Current timestamp as number
      type: 'error',
      status: 'error',
      amount: String(0), // Zero as string
      source: undefined,
      destination: undefined
    };
  }
}
