
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, TrendingUp } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export function HeroSection() {
  const { isConnected } = useWalletConnection();
  
  return (
    <section className="py-12 md:py-16 text-center space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Αυτοματοποιημένη αγορά & πώληση <span className="text-primary">Solana tokens</span> με AI
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Αναπτύξτε, διαχειριστείτε και βελτιστοποιήστε trading bots για το Solana blockchain
        χωρίς να χρειάζεται να γράψετε κώδικα.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        {isConnected ? (
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 px-6 py-6 h-auto text-base">
              <LayoutDashboard className="h-5 w-5" />
              Πίνακας Ελέγχου
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        ) : null}
        <Link to="/bot-control">
          <Button size="lg" variant="outline" className="gap-2 px-6 py-6 h-auto text-base">
            <TrendingUp className="h-5 w-5" />
            Έλεγχος Trading Bot
          </Button>
        </Link>
      </div>
    </section>
  );
}
