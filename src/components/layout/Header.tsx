
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Settings, Wallet, ArrowRight } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { isConnected, walletAddress, solBalance, connectWallet, disconnectWallet } = useWalletConnection();
  
  const displayAddress = walletAddress ? 
    `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : 
    "Δεν έχει συνδεθεί πορτοφόλι";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">SOL</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block">
                    {displayAddress}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Το Πορτοφόλι μου</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-between">
                  <span>Υπόλοιπο</span>
                  <span className="font-medium">{solBalance} SOL</span>
                </DropdownMenuItem>
                <Link to="/settings">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Ρυθμίσεις</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={disconnectWallet} className="text-destructive cursor-pointer">
                  Αποσύνδεση Πορτοφολιού
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              size="sm" 
              className="flex items-center gap-2"
              onClick={connectWallet}
            >
              <Wallet className="h-4 w-4" />
              Σύνδεση Πορτοφολιού
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
