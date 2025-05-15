
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "react-router-dom";
import { Twitter, Github, Mail, ExternalLink, Layers } from "lucide-react";

export function FooterSection() {
  const { t } = useLanguage();
  
  const mainLinks = [
    { title: t("general.home", "Αρχική"), href: "/" },
    { title: t("general.dashboard", "Πίνακας Ελέγχου"), href: "/dashboard" },
    { title: t("wallet.walletStatus", "Πορτοφόλι"), href: "/wallet" },
    { title: t("makerBot.botSettings", "Ρυθμίσεις Bot"), href: "/bot-control" },
    { title: t("platform.howItWorksTitle", "Πώς Λειτουργεί"), href: "#how-it-works" },
  ];
  
  const resourceLinks = [
    { title: t("help.documentation", "Τεκμηρίωση"), href: "/help" },
    { title: "Solana.com", href: "https://solana.com", external: true },
    { title: "Solana Developers", href: "https://solana.com/developers", external: true },
    { title: "Phantom Wallet", href: "https://phantom.app", external: true },
  ];
  
  const supportLinks = [
    { title: t("general.help", "Βοήθεια"), href: "/help" },
    { title: t("security.title", "Ασφάλεια"), href: "/security" },
    { title: t("apiVault.manageApiKeys", "API Vault"), href: "/api-vault" },
    { title: t("general.settings", "Ρυθμίσεις"), href: "/settings" },
  ];
  
  return (
    <footer className="relative pt-24 pb-12 bg-gray-950 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <div className="absolute top-10 left-10 w-48 h-48 bg-blue-900/10 rounded-full filter blur-3xl z-0"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-900/10 rounded-full filter blur-3xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo and About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Solana Trade Automator
              </h3>
            </div>
            <p className="text-gray-400 mb-6">
              {t("hero.welcomeDescription", "Η κορυφαία πλατφόρμα αυτοματοποιημένων συναλλαγών για το Solana blockchain.")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Twitter className="h-5 w-5 text-blue-400" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Github className="h-5 w-5 text-white" />
              </a>
              <a href="mailto:info@solanatrade.com" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Mail className="h-5 w-5 text-purple-400" />
              </a>
            </div>
          </div>
          
          {/* Main Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t("general.navigation", "Πλοήγηση")}
            </h3>
            <ul className="space-y-3">
              {mainLinks.map((link, index) => (
                <li key={index} className="group">
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span className="h-1 w-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("help.usefulLinks", "Χρήσιμοι Σύνδεσμοι")}
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index} className="group">
                  {link.external ? (
                    <a 
                      href={link.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="h-1 w-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.title}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  ) : (
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span className="h-1 w-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {t("general.support", "Υποστήριξη")}
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index} className="group">
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom part */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Solana Trade Automator. {t("general.allRightsReserved", "Όλα τα δικαιώματα διατηρούνται.")}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
              {t("general.terms", "Όροι Χρήσης")}
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
              {t("general.privacy", "Πολιτική Απορρήτου")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
