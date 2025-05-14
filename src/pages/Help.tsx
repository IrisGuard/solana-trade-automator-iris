import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Wallet, Bot, FileText, Book, Video, HeartHandshake } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Βοήθεια & Υποστήριξη</h2>
          <p className="text-muted-foreground">Βρείτε απαντήσεις και λύσεις για τη χρήση της πλατφόρμας</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Αναζητήστε βοήθεια..." className="pl-8" />
          </div>
          <Button>Αναζήτηση</Button>
        </div>
      </div>

      <Tabs defaultValue="faq">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="faq">Συχνές Ερωτήσεις</TabsTrigger>
          <TabsTrigger value="guides">Οδηγοί</TabsTrigger>
          <TabsTrigger value="videos">Βίντεο</TabsTrigger>
          <TabsTrigger value="contact">Επικοινωνία</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Συχνές Ερωτήσεις
              </CardTitle>
              <CardDescription>
                Απαντήσεις στις πιο συχνές ερωτήσεις των χρηστών
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Πώς συνδέομαι με το Phantom Wallet;</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Για να συνδεθείτε με το Phantom Wallet, ακολουθήστε τα παρακάτω βήματα:
                    </p>
                    <ol className="list-decimal list-inside mt-2 space-y-2">
                      <li>Εγκαταστήστε το Phantom Wallet από το <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-primary underline">phantom.app</a></li>
                      <li>Δημιουργήστε ένα νέο πορτοφόλι ή εισάγετε ένα υπάρχον</li>
                      <li>Επιστρέψτε στην εφαρμογή και πατήστε το κουμπί "Σύνδεση με Phantom Wallet"</li>
                      <li>Εγκρίνετε τη σύνδεση στο παράθυρο του Phantom Wallet</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Πώς λειτουργεί το Trading Bot;</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Το Trading Bot της πλατφόρμας μας χρησιμοποιεί προηγμένους αλγόριθμους για να εκτελεί
                      αυτοματοποιημένες συναλλαγές στο δίκτυο Solana. Ακολουθεί τη στρατηγική που έχετε ορίσει
                      και παρακολουθεί την αγορά 24/7 για να αναγνωρίσει ευκαιρίες.
                    </p>
                    <p className="mt-2">
                      Για να ρυθμίσετε το Trading Bot:
                    </p>
                    <ol className="list-decimal list-inside mt-2 space-y-2">
                      <li>Μεταβείτε στην καρτέλα "Trading Bot" ή στη σελίδα "Bot Control"</li>
                      <li>Επιλέξτε ένα token από τη λίστα</li>
                      <li>Ορίστε τις παραμέτρους της στρατηγικής σας (τιμές εισόδου/εξόδου, όρια κ.λπ.)</li>
                      <li>Πατήστε "Έναρξη Bot" για να ξεκινήσει η λειτουργία του</li>
                    </ol>
                    <p className="mt-2">
                      Μπορείτε να παρακολουθείτε την απόδοση του bot σε πραγματικό χρόνο και να κάνετε προσαρμογές όποτε χρειάζεται.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Πώς μπορώ να δω το ιστορικό των συναλλαγών μου;</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Για να δείτε το ιστορικό των συναλλαγών σας:
                    </p>
                    <ol className="list-decimal list-inside mt-2 space-y-2">
                      <li>Συνδεθείτε με το wallet σας</li>
                      <li>Στο κεντρικό dashboard, θα βρείτε την καρτέλα "Πρόσφατες Συναλλαγές"</li>
                      <li>Για πιο αναλυτικό ιστορικό, επισκεφθείτε τη σελίδα "Συναλλαγές"</li>
                      <li>Για προηγμένες λειτουργίες ανάλυσης, επισκεφθείτε τη σελίδα "Προηγμένες Συναλλαγές"</li>
                    </ol>
                    <p className="mt-2">
                      Μπορείτε να φιλτράρετε τις συναλλαγές σας κατά ημερομηνία, τύπο συναλλαγής, token κ.λπ.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Πώς διαχειρίζομαι τα API κλειδιά μου;</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Για τη διαχείριση των API κλειδιών:
                    </p>
                    <ol className="list-decimal list-inside mt-2 space-y-2">
                      <li>Πλοηγηθείτε στη σελίδα "API Vault" από το μενού πλοήγησης</li>
                      <li>Προσθέστε νέα κλειδιά επιλέγοντας την υπηρεσία και καταχωρώντας τα στοιχεία</li>
                      <li>Διαχειριστείτε τα υπάρχοντα κλειδιά μέσω των επιλογών επεξεργασίας και διαγραφής</li>
                      <li>Εξάγετε τα κλειδιά σας με κρυπτογράφηση για ασφαλή αποθήκευση</li>
                    </ol>
                    <p className="mt-2">
                      Όλα τα API κλειδιά αποθηκεύονται με ασφάλεια και είναι κρυπτογραφημένα στη βάση δεδομένων.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Πώς μπορώ να επικοινωνήσω με την υποστήριξη;</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Για οποιαδήποτε βοήθεια ή απορία, μπορείτε να επικοινωνήσετε με την ομάδα υποστήριξης μέσω:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>Email: support@solanatrade.app</li>
                      <li>Φόρμα επικοινωνίας στην καρτέλα "Επικοινωνία" αυτής της σελίδας</li>
                      <li>Discord: <a href="https://discord.gg/solanatrade" target="_blank" rel="noopener noreferrer" className="text-primary underline">discord.gg/solanatrade</a></li>
                    </ul>
                    <p className="mt-2">
                      Η ομάδα υποστήριξης είναι διαθέσιμη καθημερινά από τις 9:00 έως τις 21:00.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Οδηγοί Χρήσης
              </CardTitle>
              <CardDescription>
                Αναλυτικοί οδηγοί για όλες τις λειτουργίες της πλατφόρμας
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="cursor-pointer hover:bg-accent/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Διαχείριση Wallet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Πλήρης οδηγός για τη σύνδεση, παρακολούθηση και διαχείριση του Solana wallet σας.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Ρύθμιση Bot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Οδηγός για τη δημιουργία, ρύθμιση και βελτιστοποίηση trading bots.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Στρατηγικές Trading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Αναλυτικές πληροφορίες για διαφορετικές στρατηγικές trading και εφαρμογή τους στα bots.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HeartHandshake className="h-4 w-4" />
                      Ασφάλεια & Προστασία
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Οδηγός για τη διασφάλιση του λογαριασμού και των συναλλαγών σας.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Βίντεο Οδηγοί
              </CardTitle>
              <CardDescription>
                Οπτικοακουστικό υλικό για την καλύτερη κατανόηση της πλατφόρμας
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-2">
                    <div className="text-muted-foreground">Βίντεο: Εισαγωγή στο Solana Trade</div>
                  </div>
                  <h3 className="font-medium">Εισαγωγή στο Solana Trade Automator</h3>
                  <p className="text-sm text-muted-foreground">Μάθετε τα βασικά της πλατφόρμας σε λιγότερο από 5 λεπτά</p>
                </div>
                
                <div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-2">
                    <div className="text-muted-foreground">Βίντεο: Δημιουργία Bot</div>
                  </div>
                  <h3 className="font-medium">Πώς να δημιουργήσετε το πρώτο σας Trading Bot</h3>
                  <p className="text-sm text-muted-foreground">Αναλυτικός οδηγός για τη δημιουργία και παραμετροποίηση ενός bot</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Επικοινωνήστε με την Υποστήριξη</CardTitle>
              <CardDescription>
                Συμπληρώστε τη φόρμα και θα επικοινωνήσουμε μαζί σας σύντομα
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Ονοματεπώνυμο</label>
                    <Input id="name" placeholder="Το ονοματεπώνυμό σας" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="Το email σας" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Θέμα</label>
                  <Input id="subject" placeholder="Θέμα του μηνύματός σας" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Μήνυμα</label>
                  <textarea
                    id="message"
                    className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Περιγράψτε το ερώτημα ή το πρόβλημά σας..."
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full">Αποστολή</Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">support@solanatrade.app</p>
                <p className="text-xs text-muted-foreground mt-1">Απάντηση εντός 24 ωρών</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Discord</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">discord.gg/solanatrade</p>
                <p className="text-xs text-muted-foreground mt-1">Άμεση υποστήριξη από την κοινότητα</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ωράριο Υποστήριξης</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Δευτ-Παρ: 9:00-21:00</p>
                <p className="text-xs text-muted-foreground mt-1">Σαβ-Κυρ: 10:00-18:00</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
