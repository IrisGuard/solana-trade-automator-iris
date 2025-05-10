
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Loader } from "lucide-react";

interface ConnectPromptProps {
  handleConnectWallet: () => void;
  isConnecting?: boolean;
  isPhantomInstalled?: boolean;
  size?: "default" | "large";
}

export function ConnectPrompt({ 
  handleConnectWallet, 
  isConnecting = false, 
  isPhantomInstalled = true,
  size = "default" 
}: ConnectPromptProps) {
  return (
    <Card className={size === "large" ? "border-dashed border-2 border-primary" : ""}>
      <CardHeader className="text-center">
        <CardTitle>Συνδεθείτε με το Phantom Wallet</CardTitle>
        <CardDescription>Συνδεθείτε για να χρησιμοποιήσετε το trading bot</CardDescription>
      </CardHeader>
      <CardContent className={`flex justify-center ${size === "large" ? "py-10" : "py-6"}`}>
        {size === "large" && (
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
        )}
        <Button 
          onClick={handleConnectWallet} 
          className={`flex items-center gap-2 ${size === "large" ? "text-base px-6 py-5 h-auto" : ""}`}
          size={size === "large" ? "lg" : "default"}
          disabled={isConnecting || !isPhantomInstalled}
        >
          {isConnecting ? (
            <>
              <Loader className={`animate-spin ${size === "large" ? "h-5 w-5" : "h-4 w-4"}`} />
              Γίνεται σύνδεση...
            </>
          ) : (
            <>
              <Wallet className={size === "large" ? "h-5 w-5" : "h-4 w-4"} />
              Σύνδεση με Phantom Wallet
            </>
          )}
        </Button>
        
        {!isPhantomInstalled && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Χρειάζεστε το Phantom Wallet για να συνδεθείτε.</p>
            <a 
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-medium"
            >
              Κάντε εγκατάσταση από το phantom.app
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
