
import { Token as TokenType } from "@/types/wallet";

/**
 * Ensures a token object conforms to the required Token interface
 * This is useful when dealing with tokens from different sources that may have
 * slight differences in their structure or property types
 * 
 * @param token The token object to normalize
 * @returns A token object conforming to the Token interface
 */
export const normalizeToken = (token: any): TokenType => {
  return {
    address: token.address || '',
    symbol: token.symbol || '',
    name: token.name || '',
    amount: typeof token.amount === 'number' ? token.amount : Number(token.amount || 0),
    decimals: token.decimals || 0,
    mint: token.mint || token.address || '',
    logo: token.logo
  };
};

/**
 * Maps an array of token-like objects to proper Token objects
 * 
 * @param tokens An array of token-like objects
 * @returns An array of normalized Token objects
 */
export const normalizeTokenArray = (tokens: any[]): TokenType[] => {
  return tokens.map(normalizeToken);
};
