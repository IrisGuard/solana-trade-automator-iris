
import { ErrorCollector } from '../utils/error-handling/collector/types';

declare global {
  interface Window {
    errorCollector?: ErrorCollector;
  }
}

export {};
