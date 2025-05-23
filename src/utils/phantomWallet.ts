
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

export async function disconnectPhantomWallet() {
  if (window.solana) {
    try {
      await window.solana.disconnect();
    } catch (error) {
      console.error('Failed to disconnect from Phantom wallet:', error);
      throw error;
    }
  }
}

export function registerPhantomEvents() {
  // Stub implementation for events
  return () => {};
}
