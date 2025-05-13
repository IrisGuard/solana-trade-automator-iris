
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { FooterSection } from "@/components/home/FooterSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b bg-background">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Solana Trade Automator</h1>
          <div className="flex items-center gap-4">
            <a href="/home" className="text-primary hover:underline">Είσοδος στο Dashboard</a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <BotExplanationSection />
        <FaqSection />
      </main>
      <FooterSection />
    </div>
  );
}
