
/**
 * Global type definitions
 */

interface Window {
  // For React compatibility
  React: any;
  __JSX_RUNTIME_PATCHED__?: boolean;
  patchedReactRouter?: boolean;

  // For Lovable chat integration
  lovableChat?: {
    [key: string]: any;
    createErrorDialog?: (errorData: any) => void;
    clearErrors?: () => void;
  };
}

// Ensure this file is treated as a module
export {};
