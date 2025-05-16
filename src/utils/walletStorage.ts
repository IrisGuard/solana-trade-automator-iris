
/**
 * @deprecated This file is kept for backward compatibility.
 * Please import from src/utils/wallet instead.
 */

// Re-export all functions from the new modules
export {
  saveWalletToLocalStorage,
  getWalletFromLocalStorage,
  loadWalletFromSupabase,
  updateWalletLastConnected,
  saveWalletToSupabase,
  getPrimaryWalletFromSupabase,
  removeWalletFromStorage
} from './wallet';
