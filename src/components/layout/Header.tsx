
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
import { ChevronDown, Settings, ArrowRight } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Link } from "react-router-dom";
import { WalletButton } from "@/components/wallet/WalletButton";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
