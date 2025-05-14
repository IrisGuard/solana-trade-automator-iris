
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectPromptProps {
  handleConnectWallet: () => void;
  size?: "default" | "large";
}

export function ConnectPrompt({ handleConnectWallet, size = "default" }: ConnectPromptProps) {
  return (
    <Card className="border-dashed border-primary/50">
      <CardHeader className="text-center">
        <CardTitle>Σύνδεση Wallet</CardTitle>
        <CardDescription>
          Συνδέστε το wallet σας για να χρησιμοποιήσετε αυτή τη λειτουργία
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("flex flex-col items-center", 
        size === "large" ? "py-12" : "py-6"
      )}>
        <div className="bg-primary/10 p-4 rounded-full mb-6">
          <Wallet className="h-10 w-10 text-primary" />
        </div>
        
        <Button onClick={handleConnectWallet}>
          Σύνδεση Wallet
        </Button>
      </CardContent>
    </Card>
  );
}
