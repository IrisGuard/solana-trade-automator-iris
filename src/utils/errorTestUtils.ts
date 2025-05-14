
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';
import { ErrorOptions } from '@/utils/error-handling/types';

interface TestErrorOptions extends ErrorOptions {
  errorType?: 'runtime' | 'syntax' | 'api' | 'network' | 'authentication';
  message?: string;
  useToast?: boolean;
  isAsync?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  code?: string;
  details?: Record<string, any>;
  title?: string;
}

/**
 * Triggers a test error with specified options for testing error handling
 */
export function triggerTestError(options: TestErrorOptions = {}) {
  const {
    errorType = 'runtime',
    message = 'This is a test error',
    component = 'TestComponent',
    useToast = true,
    isAsync = false,
    code = 'ERR_TEST',
    severity = 'low',
    context = {},
    title
  } = options;

  // Create the error with the provided message
  const error = new Error(message);

  if (isAsync) {
    setTimeout(() => {
      if (useToast) {
        toast.error(message);
      }
      errorCollector.captureError(error, { 
        component, 
        code, 
        context,
        severity,
        title
      });
    }, 100);
    return;
  }

  // Trigger different error types
  switch (errorType) {
    case 'runtime':
      errorCollector.captureError(error, { component, code, context, severity, title });
      break;
    case 'syntax':
      errorCollector.captureError(new SyntaxError(message), { component, code, context, severity, title });
      break;
    case 'api':
      errorCollector.captureError(message, { component: 'APIService', code: 'API_ERROR', context, severity, title });
      break;
    case 'network':
      errorCollector.captureError(message, { component: 'NetworkService', code: 'NETWORK_ERROR', context, severity, title });
      break;
    case 'authentication':
      errorCollector.captureError(message, { component: 'AuthService', code: 'AUTH_ERROR', context, severity, title });
      break;
    default:
      errorCollector.captureError(error, { component, code, context, severity, title });
  }
}

/**
 * Clear all errors from the error collector
 */
export function clearAllErrors() {
  errorCollector.clearAllErrors();
}
