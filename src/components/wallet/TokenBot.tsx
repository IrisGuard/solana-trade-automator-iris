
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Token } from "@/types/wallet";
import { useLanguage } from "@/hooks/use-language";

interface TokenBotProps {
  tokens: Token[];
  isConnected: boolean;
  onConnectWallet: () => Promise<void>;
}

export function TokenBot({ tokens, isConnected, onConnectWallet }: TokenBotProps) {
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [botActive, setBotActive] = useState(false);
  const { t } = useLanguage();
  
  // Handle starting the bot
  const handleStartBot = () => {
    if (!selectedToken) return;
    
    setBotActive(true);
  };
  
  // Handle stopping the bot
  const handleStopBot = () => {
    setBotActive(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{t("tokenBot.title")}</CardTitle>
            <CardDescription>{t("tokenBot.description")}</CardDescription>
          </div>
          
          {botActive && (
            <Badge variant="success" className="bg-green-500">
              {t("tokenBot.active")}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("tokenBot.connectWallet")}
            </AlertDescription>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={onConnectWallet}
            >
              {t("general.connectWallet")}
            </Button>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("tokenBot.selectToken")}
              </label>
              <Select
                value={selectedToken}
                onValueChange={setSelectedToken}
                disabled={botActive}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("tokenBot.selectTokenPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map(token => (
                    <SelectItem key={token.address} value={token.address}>
                      <div className="flex items-center">
                        {token.logo && (
                          <img
                            src={token.logo}
                            alt={token.symbol}
                            className="w-5 h-5 mr-2 rounded-full"
                          />
                        )}
                        {token.symbol} - {token.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedToken && (
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">{t("tokenBot.botSettings")}</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("tokenBot.buyThreshold")}
                    </p>
                    <p>3%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("tokenBot.sellThreshold")}
                    </p>
                    <p>5%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("tokenBot.stopLoss")}
                    </p>
                    <p>10%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("tokenBot.takeProfit")}
                    </p>
                    <p>15%</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  {!botActive ? (
                    <Button onClick={handleStartBot}>
                      {t("tokenBot.startBot")}
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={handleStopBot}>
                      {t("tokenBot.stopBot")}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
