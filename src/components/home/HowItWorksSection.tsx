
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Wallet, Bot, Settings, BarChart3 } from "lucide-react";

export function HowItWorksSection() {
  const { t } = useLanguage();
  
  const steps = [
    {
      number: "01",
      title: t("platform.step1Title"),
      description: t("platform.step1Desc"),
      icon: <Wallet className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "blue"
    },
    {
      number: "02",
      title: t("platform.step2Title"),
      description: t("platform.step2Desc"),
      icon: <Bot className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "purple"
    },
    {
      number: "03",
      title: t("platform.step3Title"),
      description: t("platform.step3Desc"),
      icon: <Settings className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "emerald"
    },
    {
      number: "04",
      title: t("platform.step4Title", "Παρακολούθηση & Βελτιστοποίηση"),
      description: t("platform.step4Desc", "Παρακολουθήστε την απόδοση των bots σας και βελτιώστε τις στρατηγικές σας με βάση τα αποτελέσματα"),
      icon: <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "amber"
    }
  ];

  const getGradient = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-cyan-400';
      case 'purple': return 'from-purple-500 to-pink-400';
      case 'emerald': return 'from-emerald-500 to-teal-400';
      case 'amber': return 'from-amber-500 to-orange-400';
      default: return 'from-blue-500 to-cyan-400';
    }
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gray-950 z-0"></div>
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-blue-900/10 to-transparent z-0"></div>
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-purple-900/10 to-transparent z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("platform.howItWorksTitle", "Πώς Λειτουργεί")}
          </h2>
          <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex-1 relative z-10">
              {/* Step indicator */}
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${getGradient(step.color)} flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-6 sm:mb-8 shadow-lg shadow-${step.color}-600/30`}>
                <span>{step.number}</span>
              </div>
              
              {/* Step card */}
              <div className={`bg-gradient-to-br ${getGradient(step.color)} p-0.5 rounded-xl shadow-lg shadow-${step.color}-600/20 h-full`}>
                <div className="bg-gray-900 rounded-lg p-5 sm:p-6 h-full">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${getGradient(step.color)}/20 flex items-center justify-center mb-4`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 line-clamp-1">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300 line-clamp-3">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
