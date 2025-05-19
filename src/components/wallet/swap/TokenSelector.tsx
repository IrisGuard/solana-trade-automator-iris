
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Token } from "@/types/wallet";

interface TokenSelectorProps {
  tokens: Token[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  excludeToken?: string;
}

export function TokenSelector({ tokens, value, onChange, disabled, excludeToken }: TokenSelectorProps) {
  const filteredTokens = excludeToken 
    ? tokens.filter(token => token.address !== excludeToken)
    : tokens;

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select token" />
      </SelectTrigger>
      <SelectContent>
        {filteredTokens.map((token) => (
          <SelectItem key={token.address} value={token.address}>
            {token.symbol} - {token.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
