
export function isPhantomInstalled(): boolean {
  return typeof window !== 'undefined' && window.solana?.isPhantom;
}

export async function connectTrustedPhantomWallet() {
  if (!isPhantomInstalled()) {
    throw new Error('Phantom wallet is not installed');
  }
  
  try {
    const resp = await window.solana.connect({ onlyIfTrusted: true });
    return resp.publicKey.toString();
  } catch (error) {
    console.error('Failed to connect to trusted Phantom wallet:', error);
    throw error;
  }
}

export async function connectPhantomWallet(onlyIfTrusted = false) {
  if (!isPhantomInstalled()) {
    throw new Error('Phantom wallet is not installed');
  }
  
  try {
    const resp = onlyIfTrusted 
      ? await window.solana.connect({ onlyIfTrusted: true })
      : await window.solana.connect();
    return resp.publicKey.toString();
  } catch (error) {
    console.error('Failed to connect to Phantom wallet:', error);
    throw error;
  }
}

export async function disconnectPhantomWallet(): Promise<boolean> {
  if (window.solana) {
    try {
      await window.solana.disconnect();
      return true;
    } catch (error) {
      console.error('Failed to disconnect from Phantom wallet:', error);
      throw error;
    }
  }
  return false;
}

// Updated to accept no parameters since we're not using them
export function registerPhantomEvents(): () => void {
  // This is a simplified implementation
  const handleConnect = () => {
    console.log("Wallet connected event");
  };
  
  const handleDisconnect = () => {
    console.log("Wallet disconnected event");
  };
  
  if (window.solana) {
    // Add event listeners
    window.solana.on('connect', handleConnect);
    window.solana.on('disconnect', handleDisconnect);
    
    // Return cleanup function
    return () => {
      window.solana?.off('connect', handleConnect);
      window.solana?.off('disconnect', handleDisconnect);
    };
  }
  
  // Return empty cleanup if no wallet
  return () => {};
}
