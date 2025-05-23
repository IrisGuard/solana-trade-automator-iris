
export function handleHeliusError(error: any): void {
  console.error('Helius service error:', error);
}

export function createErrorHandler(service: string) {
  return (error: any) => {
    console.error(`${service} error:`, error);
  };
}
