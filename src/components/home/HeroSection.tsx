
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Lock, Wallet, Zap, ArrowRight, BarChart3, Bot } from "lucide-react";
import { WalletConnectButtonSafe } from "@/components/wallet/WalletConnectButtonSafe";
import { toast } from "sonner";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";

export function HeroSection() {
  const navigate = useNavigate();
  const { isConnected } = usePhantomConnection();
  
  const handleNavigateWithToast = (path: string, message: string) => {
    toast.success(message);
    navigate(path);
  };
  
  const handleGetStarted = () => {
    if (isConnected) {
      handleNavigateWithToast('/dashboard', "Navigate to Dashboard");
    } else {
      handleNavigateWithToast('/wallet', "Please connect your wallet");
    }
  };
  
  return (
    <div className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black overflow-hidden">
      <div className="absolute top-1/4 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-2/3 left-1/3 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      
      <div className="container mx-auto max-w-6xl flex flex-col items-center text-center relative z-10">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Solana Trade Automator
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed px-4">
            Manage your crypto, automate your transactions, and monitor your funds - all in one place
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-700/30 hover:shadow-blue-800/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-sm sm:text-base py-5 sm:py-6 px-4 sm:px-6"
            >
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Get Started Now</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 flex-shrink-0" />
            </Button>
            
            {!isConnected && (
              <WalletConnectButtonSafe
                variant="outline"
                size="lg"
                className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 backdrop-blur-md border border-purple-400/20 text-white hover:bg-purple-500/20 hover:border-purple-400/40 shadow-lg shadow-purple-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-sm sm:text-base py-5 sm:py-6 px-4 sm:px-6"
              >
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">Connect Wallet</span>
              </WalletConnectButtonSafe>
            )}
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNavigateWithToast('/bot-control', "Navigate to Trading Bots")}
              className="bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 backdrop-blur-md border border-emerald-400/20 text-white hover:bg-emerald-500/20 hover:border-emerald-400/40 shadow-lg shadow-emerald-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-sm sm:text-base py-5 sm:py-6 px-4 sm:px-6"
            >
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Bot Settings</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
            <FeatureButton 
              icon={<Wallet className="h-6 w-6" />}
              title="Connect Wallet" 
              description="Connect your Solana wallet to get started"
              onClick={() => navigate('/wallet')}
              gradient="from-blue-600 to-cyan-500"
            />
            
            <FeatureButton 
              icon={<Bot className="h-6 w-6" />}
              title="Select Bot" 
              description="Choose between different trading bots"
              onClick={() => navigate('/bot-control')}
              gradient="from-purple-600 to-pink-500"
            />
            
            <FeatureButton 
              icon={<BarChart3 className="h-6 w-6" />}
              title="Configure Settings" 
              description="Customize operation parameters"
              onClick={() => navigate('/dashboard')}
              gradient="from-amber-500 to-orange-600"
            />
            
            <FeatureButton 
              icon={<Zap className="h-6 w-6" />}
              title="Monitor Performance" 
              description="Track bot performance and results"
              onClick={() => navigate('/portfolio')}
              gradient="from-emerald-500 to-teal-600"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 sm:mt-20">
            <StatCard value="24/7" label="Automated Trading" color="blue" />
            <StatCard value="+25%" label="Average Returns" color="purple" />
            <StatCard value="0.1%" label="Low Fees" color="emerald" />
            <StatCard value="100%" label="Fund Control" color="amber" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  gradient: string;
}

function FeatureButton({ title, description, icon, onClick, gradient }: FeatureButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} p-0.5 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
    >
      <div className="h-full w-full px-3 sm:px-5 py-4 sm:py-6 bg-gray-900 rounded-md flex flex-col items-center text-center">
        <div className="mb-3 p-2 sm:p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
          {icon}
        </div>
        <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 group-hover:text-white line-clamp-1">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">{description}</p>
      </div>
    </button>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  color: 'blue' | 'purple' | 'emerald' | 'amber';
}

function StatCard({ value, label, color }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-600 to-cyan-500 shadow-blue-700/30",
    purple: "from-purple-600 to-pink-500 shadow-purple-700/30",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-700/30",
    amber: "from-amber-500 to-orange-600 shadow-amber-700/30"
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-0.5 rounded-lg shadow-lg transition-all hover:shadow-xl`}>
      <div className="bg-gray-900 h-full w-full rounded-md p-3 sm:p-5 text-center">
        <p className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent mb-1`}>{value}</p>
        <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">{label}</p>
      </div>
    </div>
  );
}
