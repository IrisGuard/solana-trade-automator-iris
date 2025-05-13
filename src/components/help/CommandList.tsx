
import React from "react";
import { useLanguage } from "@/providers/LanguageProvider";

// Λίστα με εντολές και την περιγραφή τους
const COMMANDS = [
  {
    command: "/connect",
    descriptionKey: "wallet.connectWallet",
  },
  {
    command: "/disconnect",
    descriptionKey: "wallet.disconnectWallet",
  },
  {
    command: "/balance",
    descriptionKey: "wallet.walletBalance",
  },
  {
    command: "/tokens",
    descriptionKey: "wallet.tokensBalance",
  },
  {
    command: "/swap [ποσό] [από] [προς]",
    descriptionKey: "Ανταλλάσσει tokens (π.χ. /swap 10 SOL USDC)",
  },
  {
    command: "/bot start",
    descriptionKey: "makerBot.startBot",
  },
  {
    command: "/bot stop",
    descriptionKey: "makerBot.stopBot",
  },
  {
    command: "/bot status",
    descriptionKey: "botStats",
  },
  {
    command: "/maker start",
    descriptionKey: "makerBot.startBot",
  },
  {
    command: "/maker stop",
    descriptionKey: "makerBot.stopBot",
  },
  {
    command: "/api list",
    descriptionKey: "apiVault.manageApiKeys",
  },
  {
    command: "/help",
    descriptionKey: "help.availableCommands",
  }
];

export function CommandList() {
  const { t } = useLanguage();
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">{t("help.availableCommands")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("help.useCommands")}
        </p>
      </div>
      
      <div className="space-y-2">
        {COMMANDS.map((cmd, index) => (
          <div key={index} className="border rounded-md p-3 hover:bg-accent">
            <div className="flex justify-between items-center">
              <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                {cmd.command}
              </code>
              <span className="text-xs text-muted-foreground">{t("general.command", "Εντολή")}</span>
            </div>
            <p className="text-sm mt-1">
              {cmd.descriptionKey.includes('.') ? t(cmd.descriptionKey) : cmd.descriptionKey}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
