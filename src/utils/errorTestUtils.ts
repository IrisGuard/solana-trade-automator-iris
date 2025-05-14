
import { errorCollector } from '@/utils/error-handling/collector';

export const clearAllErrors = () => {
  errorCollector.clearAllErrors();
};

export const simulateError = (message: string, code?: string): Error => {
  const error = new Error(message);
  if (code) {
    (error as any).code = code;
  }
  return error;
};

export const simulateNetworkError = (status = 500, statusText = 'Internal Server Error'): Error => {
  const error = new Error(`Network error: ${status} ${statusText}`);
  (error as any).status = status;
  return error;
};

export const simulateAsyncError = async (): Promise<void> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Simulated async operation failed'));
    }, 500);
  });
};
