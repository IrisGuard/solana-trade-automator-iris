
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { WalletButton } from "@/components/wallet/WalletButton";
import { HelpButton } from "@/components/help/HelpButton";

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-end mb-4">
          <WalletButton />
        </div>
        <Outlet />
      </div>
      
      <HelpButton />
      <Toaster />
    </div>
  );
}
