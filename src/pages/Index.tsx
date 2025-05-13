
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { FooterSection } from "@/components/home/FooterSection";
import { FaqSection } from "@/components/home/FaqSection";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <BotExplanationSection />
        <FaqSection />
      </main>
      <FooterSection />
    </div>
  );
}
