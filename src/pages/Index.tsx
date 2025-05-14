import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletConnectButtonSafe } from "@/components/wallet/WalletConnectButtonSafe";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";

export default function Index() {
  const { t } = useLanguage();
  const { isConnected } = usePhantomConnection();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Header navigation */}
      <header className="p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Solana Trade Automator</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-blue-400 hover:text-blue-300">
              general.dashboard
            </Link>
            <Link to="/bot-control" className="text-blue-400 hover:text-blue-300">
              Ρυθμίσεις Bot
            </Link>
            <WalletConnectButtonSafe 
              variant="outline" 
              size="sm"
              className="bg-transparent border border-gray-700 text-white"
            >
              Αποσύνδεση Wallet
            </WalletConnectButtonSafe>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Καλωσορίσατε στο Solana Trade Automator!
        </h1>
        <p className="text-xl mb-8 max-w-3xl">
          Η κορυφαία πλατφόρμα αυτοματοποιημένων συναλλαγών για το Solana blockchain.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg bg-blue-500 hover:bg-blue-600"
            asChild
          >
            <Link to={isConnected ? "/dashboard" : "/wallet"}>
              Ξεκινήστε Τώρα
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-6 text-lg border-gray-600 text-white hover:bg-gray-800"
            asChild
          >
            <a href="#bot-explanation">
              Μάθετε Περισσότερα
            </a>
          </Button>
        </div>
      </section>
      
      {/* Second banner section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Solana Trade Automator
          </h2>
          <p className="text-xl mb-12 max-w-4xl mx-auto">
            Διαχειριστείτε τα κρυπτονομίσματά σας, αυτοματοποιήστε τις συναλλαγές σας και παρακολουθήστε τα κεφάλαιά σας - όλα σε ένα μέρος
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg bg-blue-500 hover:bg-blue-600"
              asChild
            >
              <Link to="/dashboard">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Είσοδος στο Dashboard
                </span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg border-gray-600 text-white hover:bg-gray-800"
              asChild
            >
              <Link to="/bot-control">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Ρυθμίσεις Bot
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Additional sections would go here */}
    </div>
  );
}
