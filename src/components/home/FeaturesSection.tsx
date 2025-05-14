
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Lock, LineChart, Bell } from "lucide-react";

export function FeaturesSection() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Zap className="h-10 w-10 text-blue-500" />,
      title: t("hero.tradeAutomationTitle"),
      description: t("hero.tradeAutomationDesc")
    },
    {
      icon: <LineChart className="h-10 w-10 text-green-500" />,
      title: t("hero.marketMonitoringTitle"),
      description: t("hero.marketMonitoringDesc")
    },
    {
      icon: <Lock className="h-10 w-10 text-purple-500" />,
      title: t("hero.securityFeaturesTitle"),
      description: t("hero.securityFeaturesDesc")
    },
    {
      icon: <Bell className="h-10 w-10 text-amber-500" />,
      title: t("hero.analyticsTitle"),
      description: t("hero.analyticsDesc")
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("platform.featuresTitle")}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2 flex flex-col items-center">
                <div className="mb-4 p-3 rounded-full bg-gray-700/50">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-300">
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
