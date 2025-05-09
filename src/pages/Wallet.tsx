
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Send, Download, Plus } from "lucide-react";

const Wallet = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Συνολικό Υπόλοιπο</CardDescription>
            <CardTitle className="text-3xl">$12,546.76</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-400 flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+5.25% αυτή την εβδομάδα</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>SOL Υπόλοιπο</CardDescription>
            <CardTitle className="text-3xl">142.5 SOL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              ≈ $10,687.50 @ $75 ανά SOL
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>USDC Υπόλοιπο</CardDescription>
            <CardTitle className="text-3xl">1,859.26 USDC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Για αγορά νέων tokens
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Διαχείριση Πορτοφολιού</CardTitle>
            <CardDescription>Αποστολή, λήψη και ανταλλαγή κρυπτονομισμάτων</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="flex flex-col items-center justify-center gap-2 h-20">
                <Send size={18} />
                <span className="text-xs">Αποστολή</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center gap-2 h-20">
                <Download size={18} />
                <span className="text-xs">Λήψη</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center gap-2 h-20">
                <Plus size={18} />
                <span className="text-xs">Αγορά</span>
              </Button>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mt-4">Για αποστολή ή λήψη χρημάτων, βεβαιωθείτε ότι χρησιμοποιείτε τις σωστές διευθύνσεις Solana.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Διεύθυνση Πορτοφολιού</CardTitle>
            <CardDescription>Η διεύθυνση Solana για το πορτοφόλι σας</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-md font-mono text-xs break-all">
              sol8HKj6SJU79kfyaMKXf8XywMJc3BXUxWnKs6zHxE5vq2eHYheu4zGNz
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">Αντιγραφή</Button>
              <Button variant="outline" size="sm">Εμφάνιση QR Code</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Ιστορικό Συναλλαγών</CardTitle>
            <CardDescription>Πρόσφατες συναλλαγές στο πορτοφόλι σας</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{i % 2 === 0 ? 'Αγορά SOL' : 'Πώληση SOL'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${i % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {i % 2 === 0 ? '+0.5 SOL' : '-0.3 SOL'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i % 2 === 0 ? '$37.50' : '$22.50'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              Προβολή Όλων των Συναλλαγών
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;
