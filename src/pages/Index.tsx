
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRight, Wallet, ExternalLink, LayoutDashboard, TrendingUp } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Link } from "react-router-dom";

const Index = () => {
  const { isConnected, walletAddress, solBalance, tokens, connectWallet, disconnectWallet } = useWalletConnection();
  
  const displayAddress = walletAddress ? 
    `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : "";

  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <section className="py-12 md:py-16 text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Αυτοματοποιημένη αγορά & πώληση <span className="text-primary">Solana tokens</span> με AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Αναπτύξτε, διαχειριστείτε και βελτιστοποιήστε trading bots για το Solana blockchain
          χωρίς να χρειάζεται να γράψετε κώδικα.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {isConnected ? (
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Πίνακας Ελέγχου
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={connectWallet} className="gap-2">
              <Wallet className="h-5 w-5" />
              Σύνδεση με Phantom Wallet
            </Button>
          )}
          <Link to="/bot-control">
            <Button size="lg" variant="outline" className="gap-2">
              <TrendingUp className="h-5 w-5" />
              Έλεγχος Trading Bot
            </Button>
          </Link>
        </div>
      </section>

      {isConnected ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Στοιχεία Πορτοφολιού</CardTitle>
              <CardDescription>Πληροφορίες για το συνδεδεμένο πορτοφόλι σας</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Διεύθυνση:</span>
                  <span className="font-mono text-sm">{walletAddress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Υπόλοιπο:</span>
                  <span className="text-sm">{solBalance} SOL</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Προβολή στο Solscan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Υπόλοιπο Tokens</CardTitle>
              <CardDescription>Τα Solana SPL tokens σας</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between pb-2 border-b last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center">
                      {token.logo ? (
                        <img src={token.logo} alt={token.symbol} className="h-6 w-6 rounded-full" />
                      ) : (
                        <span className="text-primary-foreground text-xs">{token.symbol}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <p className="text-sm text-muted-foreground">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{token.amount.toLocaleString()} {token.symbol}</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-xs" 
                      onClick={() => window.open(`https://solscan.io/token/${token.address}`, '_blank')}
                    >
                      Προβολή <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link to="/tokens">
                  <Button variant="outline" size="sm" className="w-full">
                    Προβολή όλων των tokens
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Πρόσφατες Συναλλαγές</CardTitle>
              <CardDescription>Πρόσφατη δραστηριότητα στο πορτοφόλι σας</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { 
                  signature: "4ZjPsQuVrLh5U6gFiDMzJHwdKVZhm7GYmAKbpvV4KSH5qhVb9TyQVypF5yQBiZcZwAJTCTUGEobYYgBfynUYdHcf",
                  blockTime: Date.now() - 1000 * 60 * 5,
                  type: "Μεταφορά",
                  status: "επιβεβαιώθηκε",
                  amount: "+0.1 SOL",
                  from: "3xT...9hN",
                  to: displayAddress
                },
                {
                  signature: "4PqRdnw9qZpU5gTC9Eqob2hsZXxVnB9GULsmgfJkJVgQZbp7sYMZYJPABAw9LJE6Y9fFQzL1FLSpnEE7zzRNc9X6",
                  blockTime: Date.now() - 1000 * 60 * 30,
                  type: "Ανταλλαγή",
                  status: "επιβεβαιώθηκε",
                  amount: "-10 USDC",
                  from: displayAddress,
                  to: "0.05 SOL"
                },
                {
                  signature: "5HvAyNxRJhY6RwtZ4QwzPJ21ZBU9f5P8rdBzx2pMRAQrMZoJWQ8YehJdhxmYw4GPDCYQXoJ6r6f1QphMTkTMLTUV",
                  blockTime: Date.now() - 1000 * 60 * 120,
                  type: "Μεταφορά",
                  status: "επιβεβαιώθηκε",
                  amount: "-0.2 SOL",
                  from: displayAddress,
                  to: "5zT...j2Lm"
                }
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{tx.type}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.blockTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.amount?.startsWith('+') ? 'text-green-500' : ''}`}>{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.type === "Ανταλλαγή" ? "Για: " : "Προς: "}{tx.to}
                    </p>
                  </div>
                </div>
              ))}
              {walletAddress && (
                <Link to="/transactions">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Προβολή Όλων των Συναλλαγών 
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Quick Bot Status and Control */}
          <Card>
            <CardHeader>
              <CardTitle>Κατάσταση Trading Bot</CardTitle>
              <CardDescription>Γρήγορη επισκόπηση και έλεγχος του bot σας</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg mb-4 text-center">
                <p className="mb-2">Το trading bot είναι ανενεργό</p>
                <Link to="/bot-control">
                  <Button>
                    Διαμόρφωση και Εκκίνηση Bot
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Κατάσταση:</div>
                <div className="text-right font-medium">Ανενεργό</div>
                <div>Τελευταία Δραστηριότητα:</div>
                <div className="text-right">Ποτέ</div>
                <div>Κέρδος/Ζημιά:</div>
                <div className="text-right">0 SOL</div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <CardTitle>Συνδεθείτε με το Phantom Wallet</CardTitle>
              <CardDescription>Συνδεθείτε για να δείτε τα tokens και το ιστορικό των συναλλαγών σας</CardDescription>
            </CardHeader>
            <CardContent className="py-10 text-center">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <Wallet className="h-10 w-10 text-muted-foreground" />
              </div>
              <Button onClick={connectWallet} className="flex mx-auto items-center gap-2">
                <Wallet className="h-4 w-4" />
                Σύνδεση με Phantom Wallet
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Τι είναι το Solana Trade Automator;</CardTitle>
              <CardDescription>Μια εισαγωγή στην πλατφόρμα μας</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Το Solana Trade Automator σας επιτρέπει να δημιουργήσετε και να διαχειριστείτε 
                αυτοματοποιημένα trading bots στο Solana blockchain, χωρίς να χρειάζεται να γράψετε κώδικα.
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium mb-2">Βασικά Χαρακτηριστικά:</h4>
                <ul className="space-y-1 list-disc pl-5 text-sm">
                  <li>Αυτοματοποιημένες αγορές και πωλήσεις με βάση τις στρατηγικές σας</li>
                  <li>Παρακολούθηση τιμών και ευκαιριών σε πραγματικό χρόνο</li>
                  <li>Διαχείριση πολλαπλών bots ταυτόχρονα</li>
                  <li>Στατιστικά και αναλύσεις της απόδοσης των bots</li>
                  <li>Ασφαλής διαχείριση API κλειδιών για συνδέσεις με ανταλλακτήρια</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard">
                  Εξερευνήστε το Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* FAQ Section */}
      <section className="pt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Συχνές Ερωτήσεις</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Πώς λειτουργεί το Trading Bot;</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Τα bots μας παρακολουθούν συνεχώς τις τιμές των tokens στο Solana blockchain 
                και εκτελούν αυτόματα συναλλαγές με βάση τις στρατηγικές και τους κανόνες 
                που έχετε ορίσει.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Είναι ασφαλή τα κεφάλαιά μου;</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Ναι, τα bots λειτουργούν με περιορισμένα δικαιώματα και δεν έχουν ποτέ 
                πρόσβαση στο ιδιωτικό σας κλειδί. Όλες οι συναλλαγές πρέπει να 
                εγκριθούν από το πορτοφόλι σας.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Τι fees υπάρχουν;</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Υπάρχουν τα κανονικά network fees του Solana για κάθε συναλλαγή.
                Η πλατφόρμα μας χρεώνει ένα μικρό ποσοστό μόνο στα κερδοφόρα trades.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Πως ξεκινάω;</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Απλώς συνδέστε το Solana wallet σας, περιηγηθείτε στο Bot Control,
                επιλέξτε μια στρατηγική και παραμετροποιήστε το bot σας. 
                Μπορείτε να το ενεργοποιήσετε άμεσα!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Footer with contact info */}
      <footer className="mt-12 pt-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-3">Solana Trade Automator</h3>
            <p className="text-sm text-muted-foreground">
              Αυτοματοποιημένο trading για το Solana blockchain,
              δημιουργημένο για traders όλων των επιπέδων.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-3">Σύνδεσμοι</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              <li><Link to="/bot-control" className="text-muted-foreground hover:text-foreground">Bot Control</Link></li>
              <li><Link to="/tokens" className="text-muted-foreground hover:text-foreground">Tokens</Link></li>
              <li><Link to="/security" className="text-muted-foreground hover:text-foreground">Security</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Επικοινωνία</h3>
            <p className="text-sm text-muted-foreground">
              Email: support@solanaautotrader.example<br />
              Twitter: @solanaautotrader<br />
              Discord: discord.gg/solanaautotrader
            </p>
          </div>
        </div>
        <p className="text-center text-muted-foreground text-sm pt-8 pb-2">
          &copy; {new Date().getFullYear()} Solana Trade Automator. Με επιφύλαξη παντός δικαιώματος.
        </p>
      </footer>
    </div>
  );
};

export default Index;
