
import React from "react";
import { useLanguage } from "@/hooks/use-language";

export function HowItWorksSection() {
  const { t } = useLanguage();
  
  const steps = [
    {
      number: "01",
      title: t("platform.step1Title"),
      description: t("platform.step1Desc"),
    },
    {
      number: "02",
      title: t("platform.step2Title"),
      description: t("platform.step2Desc"),
    },
    {
      number: "03",
      title: t("platform.step3Title"),
      description: t("platform.step3Desc"),
    },
    {
      number: "04",
      title: t("platform.step4Title", "Παρακολούθηση & Βελτιστοποίηση"),
      description: t("platform.step4Desc", "Παρακολουθήστε την απόδοση των bots σας και βελτιώστε τις στρατηγικές σας με βάση τα αποτελέσματα"),
    }
  ];

  return (
    <section className="py-16 bg-gray-800/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("platform.howItWorksTitle", "Πώς Λειτουργεί")}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step number */}
              <div className="text-6xl font-bold opacity-20 absolute -top-6 left-0">
                {step.number}
              </div>
              
              {/* Content */}
              <div className="pt-8 pl-4">
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-1/2 h-[2px] bg-gradient-to-r from-blue-500 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
