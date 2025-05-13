
import React from "react";
import { SolanaResourceList } from "./solana/SolanaResourceList";
import { SolanaResourceExplorer } from "./solana/SolanaResourceExplorer";
import { Separator } from "@/components/ui/separator";

export function SolanaDocumentation() {
  return (
    <div className="space-y-6">
      <SolanaResourceExplorer />
      <Separator className="my-6" />
      <SolanaResourceList />
    </div>
  );
}
