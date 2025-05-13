
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { useWallet } from '@solana/wallet-adapter-react';
import { AddHeliusButton } from "@/components/security/apiVault/AddHeliusButton";
import { SupabaseApiKeysList } from "@/components/security/SupabaseApiKeysList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, Shield, Wallet } from "lucide-react";

const Index = () => {
  const { connected, connecting } = useWallet();
  
  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      {!connected && (
        <WalletDisconnectedContent 
          isConnecting={connecting}
          isPhantomInstalled={true}
        />
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Dashboard
            </CardTitle>
            <CardDescription>Προβολή στατιστικών και διαχείριση</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Παρακολουθήστε την απόδοση των συναλλαγών σας και δείτε αναλυτικά γραφήματα
            </p>
            <Link to="/home" className="w-full">
              <Button variant="outline" className="w-full">Μετάβαση στο Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Πορτοφόλι & Trading
            </CardTitle>
            <CardDescription>Διαχείριση συναλλαγών και trading</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Διαχειριστείτε τα κρυπτονομίσματά σας και ρυθμίστε τα trading bots
            </p>
            <Link to="/wallet" className="w-full">
              <Button variant="outline" className="w-full">Μετάβαση στο Wallet</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Ασφάλεια & API
            </CardTitle>
            <CardDescription>Διαχείριση ασφάλειας και κλειδιών API</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Διαχειριστείτε τις ρυθμίσεις ασφάλειας και τα κλειδιά API σας
            </p>
            <Link to="/security" className="w-full">
              <Button variant="outline" className="w-full">Μετάβαση στην Ασφάλεια</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Navigation for Preview */}
      <div className="flex flex-col gap-4 my-8 border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-center">Άμεση Πρόσβαση στις Σελίδες</h2>
        <p className="text-center text-muted-foreground mb-4">
          Μπορείτε να περιηγηθείτε στις βασικές σελίδες της εφαρμογής παρακάτω
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/home">
            <Button variant="outline" className="w-full">Dashboard</Button>
          </Link>
          <Link to="/wallet">
            <Button variant="outline" className="w-full">Wallet</Button>
          </Link>
          <Link to="/security">
            <Button variant="outline" className="w-full">Security</Button>
          </Link>
          <Link to="/help">
            <Button variant="outline" className="w-full">Βοήθεια</Button>
          </Link>
        </div>
      </div>
      
      {/* API Key Action */}
      <div className="flex justify-center my-8">
        <AddHeliusButton />
      </div>
      
      {/* Supabase API Keys List */}
      <div className="my-8">
        <SupabaseApiKeysList />
      </div>
      
      {/* Bot Explanation Section */}
      <BotExplanationSection />
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
