
import { useState, useEffect } from "react";
import { Token } from "@/types/wallet";
import { COMMON_TOKEN_LIST } from "../types";

export function useTokenList(tokens: Token[] | null | undefined) {
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      // Create a set of token addresses to avoid duplicates
      const tokenAddressSet = new Set(tokens.map(token => token.address));
      
      // Add common tokens if they're not already in the user's tokens
      const combinedTokens = [...tokens];
      
      COMMON_TOKEN_LIST.forEach(commonToken => {
        if (!tokenAddressSet.has(commonToken.mint)) {
          combinedTokens.push({
            address: commonToken.mint,
            symbol: commonToken.symbol,
            name: commonToken.name,
            decimals: commonToken.decimals,
            amount: 0,
            logo: "",
            mint: commonToken.mint
          });
        }
      });
      
      setAvailableTokens(combinedTokens);
    } else {
      // If no user tokens are available, use common tokens
      const formattedCommonTokens = COMMON_TOKEN_LIST.map(token => ({
        address: token.mint,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        amount: 0,
        logo: "",
        mint: token.mint
      }));
      
      setAvailableTokens(formattedCommonTokens);
    }
  }, [tokens]);

  return availableTokens;
}
