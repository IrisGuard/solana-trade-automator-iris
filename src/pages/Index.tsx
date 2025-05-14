
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { FooterSection } from "@/components/home/FooterSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ThemeToggleHeader } from "@/components/layout/ThemeToggleHeader";
import { WalletConnectButtonSafe } from "@/components/wallet/WalletConnectButtonSafe";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { BookOpenText, Coins, LightbulbIcon, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Solana Trade Automator</h1>
          <div className="flex items-center gap-4">
            <Link to="/home" className="text-primary hover:underline">{t("general.home")}</Link>
            <Link to="/bot-control" className="text-primary hover:underline">{t("makerBot.botSettings")}</Link>
            <WalletConnectButtonSafe variant="outline" size="sm" />
            <ThemeToggleHeader />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <HeroSection />
        
        {/* Πλεονεκτήματα Πλατφόρμας */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Γιατί να επιλέξετε το Solana Trade Automator</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Αυτοματοποιημένες Συναλλαγές</h3>
                <p className="text-muted-foreground">Αυτοματοποιήστε τις συναλλαγές σας με βάση προκαθορισμένες παραμέτρους</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Διαχείριση Portfolio</h3>
                <p className="text-muted-foreground">Παρακολουθήστε όλα τα tokens σας και την απόδοσή τους σε ένα μέρος</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpenText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Αναλυτικά Στατιστικά</h3>
                <p className="text-muted-foreground">Λάβετε αναλυτικές αναφορές για την απόδοση των συναλλαγών σας</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <LightbulbIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart AI</h3>
                <p className="text-muted-foreground">Αξιοποιήστε προηγμένους αλγόριθμους AI για τη λήψη επενδυτικών αποφάσεων</p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/home">Ξεκινήστε Τώρα</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <BotExplanationSection />
        <FaqSection />
      </main>
      
      <FooterSection />
    </div>
  );
}
