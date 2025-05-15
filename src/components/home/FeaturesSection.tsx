
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";
import { Zap, Lock, LineChart, Bell, ArrowRight, BarChart3, Bot, Shield, Settings } from "lucide-react";

export function FeaturesSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Zap className="h-12 w-12" />,
      title: t("hero.tradeAutomationTitle"),
      description: t("hero.tradeAutomationDesc"),
      gradient: "from-blue-500 to-cyan-400",
      shadowColor: "shadow-blue-600/30",
      path: '/bot-control'
    },
    {
      icon: <LineChart className="h-12 w-12" />,
      title: t("hero.marketMonitoringTitle"),
      description: t("hero.marketMonitoringDesc"),
      gradient: "from-purple-500 to-pink-400",
      shadowColor: "shadow-purple-600/30",
      path: '/dashboard'
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: t("hero.securityFeaturesTitle"),
      description: t("hero.securityFeaturesDesc"),
      gradient: "from-emerald-500 to-teal-400",
      shadowColor: "shadow-emerald-600/30",
      path: '/security'
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: t("hero.analyticsTitle"),
      description: t("hero.analyticsDesc"),
      gradient: "from-amber-500 to-orange-400",
      shadowColor: "shadow-amber-600/30",
      path: '/portfolio'
    },
    {
      icon: <Bot className="h-12 w-12" />,
      title: t("hero.multiStrategyTitle"),
      description: t("hero.multiStrategyDesc"),
      gradient: "from-indigo-500 to-blue-400",
      shadowColor: "shadow-indigo-600/30",
      path: '/bots'
    },
    {
      icon: <Settings className="h-12 w-12" />,
      title: t("makerBot.title", "Ρυθμίσεις Bot"),
      description: t("makerBot.configureDesc", "Προσαρμόστε τις ρυθμίσεις των bots σας για βέλτιστα αποτελέσματα"),
      gradient: "from-rose-500 to-pink-400",
      shadowColor: "shadow-rose-600/30",
      path: '/settings'
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950 z-0"></div>
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-gray-900/0 via-blue-900/10 to-gray-900/0 z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full filter blur-3xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("platform.featuresTitle", "Χαρακτηριστικά Πλατφόρμας")}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t("platform.description", "Η πλατφόρμα μας παρέχει προηγμένα εργαλεία για τη διαχείριση των συναλλαγών σας στο Solana blockchain.")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              onClick={() => handleNavigate(feature.path)}
              className={`bg-gradient-to-br ${feature.gradient} p-0.5 rounded-xl ${feature.shadowColor} shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.03] cursor-pointer group`}
            >
              <div className="bg-gray-900 h-full w-full rounded-lg p-8 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.gradient} bg-opacity-20`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-white">{feature.title}</h3>
                <p className="text-gray-300 mb-6 flex-grow">{feature.description}</p>
                <div className={`flex items-center text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}>
                  <span className="group-hover:underline">{t("general.learnMore", "Μάθετε περισσότερα")}</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
