
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletConnectButtonSafe } from "@/components/wallet/WalletConnectButtonSafe";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { UserTokensSection } from "@/components/home/UserTokensSection";
import { UserBotsSection } from "@/components/home/UserBotsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";
import { Layers, Menu, X, Key } from "lucide-react";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

export default function Index() {
  const { t } = useLanguage();
  const { isConnected } = usePhantomConnection();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navigation = [
    { title: t("general.dashboard"), href: "/dashboard" },
    { title: t("wallet.walletStatus"), href: "/wallet" },
    { title: t("makerBot.botSettings"), href: "/bot-control" },
    { title: t("general.apiVault"), href: "/api-vault" },
    { title: t("general.help"), href: "/help" },
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Header navigation - με βελτιωμένη ευθυγράμμιση για τα Ελληνικά */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline-block truncate max-w-[240px]">
              Solana Trade Automator
            </h1>
          </Link>
          
          {/* Desktop Navigation - προσαρμοσμένο για ελληνικά */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {navigation.map((item, index) => (
              <Link 
                key={index}
                to={item.href} 
                className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors whitespace-nowrap px-2 py-1"
              >
                {item.title}
              </Link>
            ))}
            
            <Link 
              to="/add-helius-key"
              className="text-sm lg:text-base text-green-400 hover:text-green-300 transition-colors whitespace-nowrap px-2 py-1 flex items-center gap-1"
            >
              <Key className="h-4 w-4" />
              Προσθήκη Κλειδιών API
            </Link>
            
            <div className="flex items-center gap-2 ml-2">
              <LanguageToggle />
              <ThemeToggle />
              <WalletConnectButtonSafe 
                variant="default" 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-900/20 whitespace-nowrap"
              />
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              aria-label={mobileMenuOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu - βελτιωμένο για ελληνικά */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800">
            <div className="container mx-auto py-3 px-4">
              <div className="flex flex-col space-y-3">
                {navigation.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-300 hover:text-white transition-colors py-2"
                  >
                    {item.title}
                  </Link>
                ))}
                <Link 
                  to="/add-helius-key"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-green-400 hover:text-green-300 transition-colors py-2 flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Προσθήκη Κλειδιών API
                </Link>
                <div className="py-2">
                  <WalletConnectButtonSafe 
                    variant="default" 
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-900/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1 pt-16">
        {/* Hero section */}
        <HeroSection />
        
        {/* Features section */}
        <FeaturesSection />
        
        {/* How it works section */}
        <HowItWorksSection />
        
        {/* User tokens section (or sample if not connected) */}
        <UserTokensSection />
        
        {/* User bots section (or sample if not connected) */}
        <UserBotsSection />
        
        {/* FAQ section */}
        <FaqSection />
      </main>
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
}
