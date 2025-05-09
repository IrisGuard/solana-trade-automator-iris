
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, BellOff, Mail, Smartphone, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Ρυθμίσεις Ειδοποιήσεων</CardTitle>
            </div>
            <CardDescription>Προσαρμόστε τις ειδοποιήσεις που λαμβάνετε</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ειδοποιήσεις Email</p>
                <p className="text-sm text-muted-foreground">Λήψη ειδοποιήσεων μέσω email</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ειδοποιήσεις Εφαρμογής</p>
                <p className="text-sm text-muted-foreground">Εμφάνιση ειδοποιήσεων στην εφαρμογή</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ειδοποιήσεις SMS</p>
                <p className="text-sm text-muted-foreground">Λήψη ειδοποιήσεων μέσω SMS</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ειδοποιήσεις Push</p>
                <p className="text-sm text-muted-foreground">Λήψη ειδοποιήσεων push στο κινητό</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              <CardTitle>Τύποι Ειδοποιήσεων</CardTitle>
            </div>
            <CardDescription>Επιλέξτε ποιους τύπους ειδοποιήσεων θέλετε να λαμβάνετε</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Συναλλαγές</p>
                <p className="text-sm text-muted-foreground">Όταν μια συναλλαγή ολοκληρώνεται</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ειδοποιήσεις Τιμής</p>
                <p className="text-sm text-muted-foreground">Όταν οι τιμές φτάνουν στα όρια που έχετε θέσει</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Δραστηριότητα Bot</p>
                <p className="text-sm text-muted-foreground">Όταν τα bots εκτελούν σημαντικές ενέργειες</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ενημερώσεις Ασφαλείας</p>
                <p className="text-sm text-muted-foreground">Για συνδέσεις και αλλαγές ασφαλείας</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              <CardTitle>Πρόσφατες Ειδοποιήσεις</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              Σήμανση όλων ως αναγνωσμένες
            </Button>
          </div>
          <CardDescription>Οι τελευταίες ειδοποιήσεις από την εφαρμογή</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Επιτυχής Συναλλαγή</p>
                  <p className="text-xs text-muted-foreground">Πριν 5 λεπτά</p>
                </div>
                <p className="text-sm text-muted-foreground">Αγορά 0.5 SOL στα $75.25 ολοκληρώθηκε επιτυχώς.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Ειδοποίηση Τιμής</p>
                  <p className="text-xs text-muted-foreground">Πριν 37 λεπτά</p>
                </div>
                <p className="text-sm text-muted-foreground">Η τιμή του SOL ξεπέρασε το όριο των $75. Τρέχουσα τιμή: $75.25.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <BellRing className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Δραστηριότητα Bot</p>
                  <p className="text-xs text-muted-foreground">Πριν 2 ώρες</p>
                </div>
                <p className="text-sm text-muted-foreground">Το TokenBot-1 ξεκίνησε μια νέα στρατηγική Grid Trading.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Προειδοποίηση Ασφαλείας</p>
                  <p className="text-xs text-muted-foreground">Χθες, 18:45</p>
                </div>
                <p className="text-sm text-muted-foreground">Εντοπίστηκε σύνδεση από νέα τοποθεσία. Αν δεν ήσασταν εσείς, αλλάξτε αμέσως τον κωδικό σας.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <TrendingDown className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Ειδοποίηση Τιμής</p>
                  <p className="text-xs text-muted-foreground">Χθες, 14:30</p>
                </div>
                <p className="text-sm text-muted-foreground">Η τιμή του BTC έπεσε κάτω από το όριο των $42,500. Τρέχουσα τιμή: $42,345.</p>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            Προβολή όλων των ειδοποιήσεων
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
