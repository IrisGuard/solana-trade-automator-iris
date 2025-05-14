
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FileText, HelpCircle, MessageSquare, Video } from "lucide-react";
import { Link } from "@/lib/router-exports";

export default function Help() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Βοήθεια</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Αναζητήστε βοήθεια..." 
          className="pl-10 w-full"
        />
      </div>
      
      <Tabs defaultValue="guides">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="guides">Οδηγοί</TabsTrigger>
          <TabsTrigger value="faq">Συχνές Ερωτήσεις</TabsTrigger>
          <TabsTrigger value="videos">Βίντεο</TabsTrigger>
          <TabsTrigger value="support">Υποστήριξη</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides" className="space-y-4">
          <h3 className="text-xl font-semibold">Οδηγοί Χρήσης</h3>
          
          {[
            "Σύνδεση με Wallet",
            "Ρύθμιση Trading Bot",
            "Διαχείριση Portfolio",
            "Ασφάλεια Λογαριασμού",
            "Χρήση API Keys"
          ].map((guide, index) => (
            <Card key={index}>
              <CardHeader className="py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{guide}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Αναλυτικός οδηγός για {guide.toLowerCase()}
                </p>
                <Button variant="outline" size="sm">Διαβάστε τον οδηγό</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-4">
          <h3 className="text-xl font-semibold">Συχνές Ερωτήσεις</h3>
          
          {[
            "Πώς συνδέομαι με το Phantom Wallet;",
            "Πόσο ασφαλή είναι τα κρυπτονομίσματά μου;",
            "Πώς λειτουργεί το trading bot;",
            "Μπορώ να αποσυνδέσω το wallet μου;",
            "Ποιες χρεώσεις υπάρχουν;"
          ].map((question, index) => (
            <Card key={index}>
              <CardHeader className="py-3">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{question}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  Απάντηση θα εμφανιστεί εδώ...
                </p>
                <Button variant="ghost" size="sm">Δείτε περισσότερα</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-4">
          <h3 className="text-xl font-semibold">Εκπαιδευτικά Βίντεο</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Εισαγωγή στο Solana Bot",
              "Trading με το Solana Bot",
              "Διαχείριση Portfolio",
              "Ρυθμίσεις Ασφαλείας"
            ].map((video, index) => (
              <Card key={index}>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardHeader className="py-2">
                  <CardTitle className="text-lg">{video}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">
                    Διάρκεια: 5:30
                  </p>
                  <Button variant="outline" size="sm">Παρακολούθηση</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="support" className="space-y-4">
          <h3 className="text-xl font-semibold">Επικοινωνία με την Υποστήριξη</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Χρειάζεστε βοήθεια;</CardTitle>
              <CardDescription>
                Η ομάδα υποστήριξής μας είναι διαθέσιμη να σας βοηθήσει με οποιαδήποτε απορία.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-medium">Live Chat</h4>
                  <p className="text-sm text-muted-foreground">Άμεση υποστήριξη από τους ειδικούς μας</p>
                </div>
                <Button className="ml-auto">Έναρξη Chat</Button>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-medium">Φόρμα Επικοινωνίας</h4>
                  <p className="text-sm text-muted-foreground">Αποστολή μηνύματος για μη επείγοντα θέματα</p>
                </div>
                <Button variant="outline" className="ml-auto">Φόρμα</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
