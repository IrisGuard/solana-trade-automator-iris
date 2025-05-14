
import React, { useEffect } from "react";
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
import { usePhantomConnection } from "@/hooks/usePhantomConnection";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function Index() {
  const { t } = useLanguage();
  const { isConnected } = usePhantomConnection();
  
  // Check if translations are working
  useEffect(() => {
    console.log("Checking translations:", {
      welcomeMessage: t("hero.welcomeMessage"),
      tagline: t("hero.tagline"),
    });
  }, [t]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Solana Trade Automator</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-primary hover:underline">{t("general.dashboard")}</Link>
            <Link to="/bot-control" className="text-primary hover:underline">{t("makerBot.botSettings")}</Link>
            <WalletConnectButtonSafe variant="outline" size="sm" />
            <ThemeToggleHeader />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Welcome Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background pt-16 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("hero.welcomeMessage")}</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">{t("hero.welcomeDescription")}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="px-8">
                <Link to={isConnected ? "/dashboard" : "/wallet"}>{t("hero.getStartedButton")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#bot-explanation">{t("hero.learnMoreButton")}</a>
              </Button>
            </div>
          </div>
        </section>
        
        <HeroSection />
        
        {/* Πλεονεκτήματα Πλατφόρμας */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t("platform.title")}</h2>
            <p className="text-lg text-center max-w-3xl mx-auto mb-12">{t("platform.description")}</p>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t("hero.tradeAutomationTitle")}</h3>
                <p className="text-muted-foreground">{t("hero.tradeAutomationDesc")}</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t("hero.portfolioManagementTitle")}</h3>
                <p className="text-muted-foreground">{t("hero.portfolioManagementDesc")}</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpenText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t("hero.analyticsTitle")}</h3>
                <p className="text-muted-foreground">{t("hero.analyticsDesc")}</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <LightbulbIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t("hero.multiStrategyTitle")}</h3>
                <p className="text-muted-foreground">{t("hero.multiStrategyDesc")}</p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="px-8">
                <Link to={isConnected ? "/bot-control" : "/wallet"}>{t("platform.createBot")}</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How to Get Started */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t("platform.gettingStarted")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="flex flex-col items-center text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("platform.step1Title")}</h3>
                  <p className="text-muted-foreground">{t("platform.step1Desc")}</p>
                </CardContent>
              </Card>
              
              <Card className="flex flex-col items-center text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("platform.step2Title")}</h3>
                  <p className="text-muted-foreground">{t("platform.step2Desc")}</p>
                </CardContent>
              </Card>
              
              <Card className="flex flex-col items-center text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("platform.step3Title")}</h3>
                  <p className="text-muted-foreground">{t("platform.step3Desc")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section id="bot-explanation">
          <BotExplanationSection />
        </section>
        <FaqSection />
      </main>
      
      <FooterSection />
    </div>
  );
}
