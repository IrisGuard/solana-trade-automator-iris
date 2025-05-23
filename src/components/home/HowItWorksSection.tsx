
import React from "react";
import { Wallet, Bot, Settings, BarChart3 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Connect your Phantom Wallet to start using the platform",
      icon: <Wallet className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "blue"
    },
    {
      number: "02",
      title: "Select Bot",
      description: "Choose which tokens to trade and select your preferred strategy",
      icon: <Bot className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "purple"
    },
    {
      number: "03",
      title: "Configure Settings",
      description: "Set your risk level, trade amounts, and threshold values",
      icon: <Settings className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "amber"
    },
    {
      number: "04",
      title: "Monitor & Optimize",
      description: "Track performance and fine-tune your strategy for optimal results",
      icon: <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "emerald"
    }
  ];
  
  const colorClasses = {
    blue: "from-blue-600 to-cyan-500",
    purple: "from-purple-600 to-pink-500", 
    amber: "from-amber-500 to-orange-600",
    emerald: "from-emerald-500 to-teal-600"
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Get started with automated trading in just four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`bg-gradient-to-br ${colorClasses[step.color as keyof typeof colorClasses]} p-0.5 rounded-xl shadow-lg`}>
                <div className="bg-gray-900 rounded-xl p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-500">{step.number}</span>
                    <div className={`p-3 rounded-full bg-gradient-to-br ${colorClasses[step.color as keyof typeof colorClasses]} text-white`}>
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-gray-600 to-gray-800"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
