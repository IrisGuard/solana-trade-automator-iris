
export function handleHeliusError(error: any, operation: string): never {
  console.error(`Helius API error in ${operation}:`, error);
  throw new Error(`Helius API error: ${error.message || 'Unknown error'}`);
}
