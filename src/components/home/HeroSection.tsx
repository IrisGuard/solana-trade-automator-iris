
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, TrendingUp, Wallet } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export function HeroSection() {
  const { isConnected, connectWallet } = useWalletConnection();
  
  return (
    <section className="py-12 md:py-16 text-center space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Αυτοματοποιημένη αγορά & πώληση <span className="text-primary">Solana tokens</span> με AI
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Αναπτύξτε, διαχειριστείτε και βελτιστοποιήστε trading bots για το Solana blockchain
        χωρίς να χρειάζεται να γράψετε κώδικα.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        {isConnected ? (
          <Link to="/dashboard">
            <Button size="lg" className="gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Πίνακας Ελέγχου
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        ) : (
          <Button size="lg" onClick={connectWallet} className="gap-2">
            <Wallet className="h-5 w-5" />
            Σύνδεση με Phantom Wallet
          </Button>
        )}
        <Link to="/bot-control">
          <Button size="lg" variant="outline" className="gap-2">
            <TrendingUp className="h-5 w-5" />
            Έλεγχος Trading Bot
          </Button>
        </Link>
      </div>
    </section>
  );
}
