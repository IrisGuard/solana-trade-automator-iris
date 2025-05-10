
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react";

export function BotStatusCard() {
  const isActive = false; // Αυτό θα συνδεθεί με το πραγματικό API αργότερα
  
  return (
    <Card className={isActive ? "border-green-200" : "border-muted"}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Κατάσταση Trading Bot</CardTitle>
          <CardDescription>Γρήγορη επισκόπηση και έλεγχος του bot σας</CardDescription>
        </div>
        <div className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
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
          isActive ? "bg-green-50" : "bg-muted/50"
        }`}>
          <p className="mb-2">
            {isActive 
              ? "Το trading bot σας είναι ενεργό και παρακολουθεί την αγορά" 
              : "Το trading bot είναι ανενεργό"
            }
          </p>
          <Link to="/bot-control">
            <Button className="gap-2">
              <TrendingUp className="h-4 w-4" />
              {isActive ? "Διαχείριση Bot" : "Διαμόρφωση και Εκκίνηση Bot"}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span>Κατάσταση:</span>
          </div>
          <div className={`text-right font-medium ${isActive ? "text-green-600" : "text-yellow-600"}`}>
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
          <div className={`text-right font-medium ${isActive ? "text-green-600" : ""}`}>
            {isActive ? "+1.2 SOL" : "0 SOL"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
