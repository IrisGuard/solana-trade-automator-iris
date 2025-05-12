
import CryptoJS from "crypto-js";
import { ApiKey } from "../types";

// Encrypt data using AES
export const encryptData = (data: any, password: string): string => {
  if (!password) {
    console.warn('Attempting to encrypt without password');
    return JSON.stringify(data);
  }
  
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      password
    ).toString();
    return encrypted;
  } catch (e) {
    console.error('Error during encryption:', e);
    return JSON.stringify(data);
  }
};

// Decrypt data using AES
export const decryptData = (encryptedData: string, password: string): any | null => {
  if (!password) {
    console.warn('Attempting to decrypt without password');
    return null;
  }
  
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, password).toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;
    return JSON.parse(decrypted);
  } catch (e) {
    console.error('Error during decryption:', e);
    return null;
  }
};

// Try to decrypt with multiple passwords
export const tryDecryptWithCommonPasswords = (encryptedData: string): any | null => {
  const commonPasswords = ['password', '123456', 'admin', 'master', 'apikey'];
  
  for (const pass of commonPasswords) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, pass).toString(CryptoJS.enc.Utf8);
      if (decrypted && (decrypted.startsWith('[') || decrypted.startsWith('{'))) {
        return JSON.parse(decrypted);
      }
    } catch (e) {
      // Continue to the next password
    }
  }
  
  return null;
};
