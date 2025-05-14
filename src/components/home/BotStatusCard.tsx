
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle, Clock, TrendingUp, ToggleLeft, ToggleRight } from "lucide-react";
import { Loader } from "lucide-react";

interface BotStatusCardProps {
  isActive: boolean;
  isLoading: boolean;
  toggleBotStatus: () => Promise<void>;
}

export function BotStatusCard({ isActive, isLoading, toggleBotStatus }: BotStatusCardProps) {
  return (
    <Card className={isActive ? "border-green-200" : "border-muted"}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Κατάσταση Trading Bot</CardTitle>
          <CardDescription>Γρήγορη επισκόπηση και έλεγχος του bot σας</CardDescription>
        </div>
        <div className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium ${
          isActive ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
        }`}>
          {isActive ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Ενεργό</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              <span>Ανενεργό</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg mb-4 text-center ${
          isActive ? "bg-green-50 dark:bg-green-900/20" : "bg-muted/50"
        }`}>
          <p className="mb-2">
            {isActive 
              ? "Το trading bot σας είναι ενεργό και παρακολουθεί την αγορά" 
              : "Το trading bot είναι ανενεργό"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <Button 
              onClick={toggleBotStatus} 
              disabled={isLoading}
              className={isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : isActive ? (
                <ToggleLeft className="h-4 w-4 mr-2" />
              ) : (
                <ToggleRight className="h-4 w-4 mr-2" />
              )}
              {isActive ? "Απενεργοποίηση" : "Ενεργοποίηση"}
            </Button>
            
            <Link to="/bot-control">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <TrendingUp className="h-4 w-4" />
                Διαχείριση Bot
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span>Κατάσταση:</span>
          </div>
          <div className={`text-right font-medium ${isActive ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>
            {isActive ? "Ενεργό" : "Ανενεργό"}
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Τελευταία Δραστηριότητα:</span>
          </div>
          <div className="text-right">
            {isActive ? "Πριν 5 λεπτά" : "Ποτέ"}
          </div>
          
          <div>Κέρδος/Ζημιά:</div>
          <div className={`text-right font-medium ${isActive ? "text-green-600 dark:text-green-400" : ""}`}>
            {isActive ? "+1.2 SOL" : "0 SOL"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
