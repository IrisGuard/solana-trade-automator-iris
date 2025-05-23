
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Layers, Menu, X, Key, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  const { isConnected } = usePhantomConnection();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Index page loaded completely");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  const handleGoToTestAPI = () => {
    toast.success("Navigate to Test API page");
    navigate("/test-api");
  };
  
  const navigation = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Wallet", href: "/wallet" },
    { title: "Bot Settings", href: "/bot-control" },
    { title: "API Vault", href: "/api-vault" },
    { title: "Help", href: "/help" },
  ];
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-950 text-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
            <h2 className="text-xl font-medium">Loading page...</h2>
            <p className="text-gray-400">Please wait while the content loads</p>
            <Button onClick={handleGoToTestAPI} className="mt-4 bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" />
              Go to Test API Page
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
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
              to="/test-api"
              className="text-sm lg:text-base text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap px-2 py-1 flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              Test API
            </Link>
            
            <Link 
              to="/add-helius-key"
              className="text-sm lg:text-base text-green-400 hover:text-green-300 transition-colors whitespace-nowrap px-2 py-1 flex items-center gap-1"
            >
              <Key className="h-4 w-4" />
              Add Helius Key
            </Link>
            
            <div className="flex items-center gap-2 ml-2">
              <ThemeToggle />
              <WalletConnectButtonSafe 
                variant="default" 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-900/20 whitespace-nowrap"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
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
                  to="/test-api"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-blue-400 hover:text-blue-300 transition-colors py-2 flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Test API
                </Link>
                <Link 
                  to="/add-helius-key"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-green-400 hover:text-green-300 transition-colors py-2 flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Add Helius Key
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
      
      <div className="mt-20 container mx-auto px-4">
        <Card className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-800/30 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">API Testing Tool</h2>
                <p className="text-gray-300">Test various API endpoints and check their responses</p>
              </div>
              <Button 
                size="lg" 
                onClick={handleGoToTestAPI}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <Search className="mr-2 h-5 w-5" />
                Go to Test API Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <main className="flex-1 pt-16">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <UserTokensSection />
        <UserBotsSection />
        <FaqSection />
      </main>
      
      <FooterSection />
    </div>
  );
}
