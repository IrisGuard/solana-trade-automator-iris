
export function useErrorReporting() {
  return {
    reportError: (error: any, context?: any) => {
      console.error('Error reported:', error, context);
    }
  };
}
