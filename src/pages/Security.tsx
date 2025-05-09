
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shield, Key, Lock, Smartphone, AlertTriangle } from "lucide-react";

const Security = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Πρόσβαση Λογαριασμού</CardTitle>
            </div>
            <CardDescription>Διαχείριση των μεθόδων πρόσβασης στο λογαριασμό σας</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Αλλαγή Κωδικού Πρόσβασης</p>
                <p className="text-sm text-muted-foreground">Ενημερώθηκε τελευταία φορά πριν από 3 μήνες</p>
              </div>
              <Button variant="outline" size="sm">Αλλαγή</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Πρόσβαση με Email</p>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              <Button variant="outline" size="sm">Επαλήθευση</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Επαλήθευση Δύο Παραγόντων</CardTitle>
            </div>
            <CardDescription>Προσθέστε επιπλέον επίπεδο ασφάλειας στο λογαριασμό σας</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Επαλήθευση Δύο Παραγόντων</p>
                <p className="text-sm text-muted-foreground">Προστατέψτε το λογαριασμό σας με 2FA</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Εφαρμογή Authenticator</p>
                <p className="text-sm text-muted-foreground">Χρήση Google Authenticator ή παρόμοιας εφαρμογής</p>
              </div>
              <Button variant="outline" size="sm">Ρύθμιση</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Επαλήθευση</p>
                <p className="text-sm text-muted-foreground">Λήψη κωδικών μέσω SMS</p>
              </div>
              <Button variant="outline" size="sm">Ρύθμιση</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle>Ασφάλεια Συναλλαγών</CardTitle>
          </div>
          <CardDescription>Ελέγξτε τις ρυθμίσεις ασφαλείας των συναλλαγών σας</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Απαίτηση 2FA για Όλες τις Συναλλαγές</p>
                <p className="text-sm text-muted-foreground">Απαιτεί επαλήθευση για κάθε συναλλαγή</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Επιβεβαίωση Email για Μεγάλες Συναλλαγές</p>
                <p className="text-sm text-muted-foreground">Αποστολή email για συναλλαγές άνω των $1000</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Λίστα Ασφαλών Διευθύνσεων</p>
                <p className="text-sm text-muted-foreground">Επιτρέπει μόνο μεταφορές σε εγκεκριμένες διευθύνσεις</p>
              </div>
              <Button variant="outline" size="sm">Διαχείριση</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Περιορισμός Συναλλαγών</p>
                <p className="text-sm text-muted-foreground">Όριο ημερήσιων συναλλαγών: $5000</p>
              </div>
              <Button variant="outline" size="sm">Αλλαγή</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Περίοδοι Σύνδεσης & Συσκευές</CardTitle>
          </div>
          <CardDescription>Διαχειριστείτε τις ενεργές συνδέσεις στο λογαριασμό σας</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">iPhone 13 Pro - Chrome</p>
                  <p className="text-sm text-muted-foreground">Athens, Greece • Τελευταία σύνδεση: Τώρα</p>
                </div>
              </div>
              <p className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Τρέχουσα Συσκευή</p>
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Windows 10 - Firefox</p>
                  <p className="text-sm text-muted-foreground">Athens, Greece • Τελευταία σύνδεση: Σήμερα 10:24</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Αποσύνδεση</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">MacBook Pro - Safari</p>
                  <p className="text-sm text-muted-foreground">Athens, Greece • Τελευταία σύνδεση: Χθες 18:35</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Αποσύνδεση</Button>
            </div>
            
            <Button variant="destructive" className="w-full mt-6">
              Αποσύνδεση από Όλες τις Συσκευές
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
