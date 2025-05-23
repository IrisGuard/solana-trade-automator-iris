
// Application configuration
export const APP_CONFIG = {
  // Production mode - using Mainnet for real data
  DEMO_MODE: false,
  
  // Solana network configuration
  NETWORK: 'mainnet-beta' as const,
  
  // Application metadata
  APP_NAME: 'Solana Trade Automator',
  APP_VERSION: '1.0.0',
  
  // Features flags
  FEATURES: {
    REAL_TRADING: true, // Enabled for production
    ERROR_REPORTING: true,
    MONITORING: true,
    DEBUG_MODE: import.meta.env.DEV,
  },
  
  // API endpoints
  SUPABASE: {
    URL: 'https://lvkbyfocssuzcdphpmfu.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk7NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc'
  },
  
  // Color scheme
  COLORS: {
    PRIMARY: '#9945FF',
    SECONDARY: '#14F195', 
    ACCENT: '#FF6B35',
    BACKGROUND: '#0D0D0D'
  }
};

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Logging utility
export const log = (message: string, ...args: any[]) => {
  if (APP_CONFIG.FEATURES.DEBUG_MODE) {
    console.log(`[${APP_CONFIG.APP_NAME}] ${message}`, ...args);
  }
};
