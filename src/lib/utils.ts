
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Περικόπτει το κείμενο στο καθορισμένο μήκος και προσθέτει ελλείψεις
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

/**
 * Ασφαλής εμφάνιση διεύθυνσης πορτοφολιού με "..." στη μέση
 */
export function formatWalletAddress(address: string | null | undefined): string {
  if (!address) return '';
  if (address.length <= 12) return address;
  
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
