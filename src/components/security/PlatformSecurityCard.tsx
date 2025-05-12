
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, Lock, UserCheck, ChevronDown, ChevronUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PlatformSecurityCard = () => {
  const [expanded, setExpanded] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    rowLevelSecurity: false,
    apiKeyEncryption: false,
    twoFactorAuth: false,
    transactionLimits: false,
    approvedAddresses: false,
    geoRestrictions: false,
    advancedEmailAuth: false,
    biometricAuth: false,
    socialAuth: false,
    transactionDelays: false,
  });

  const handleToggle = (setting: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleSaveSettings = () => {
    // Εδώ θα μπορούσατε να αποθηκεύσετε τις ρυθμίσεις στο Supabase όταν είναι έτοιμο
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
    toast.success("Οι ρυθμίσεις ασφαλείας αποθηκεύτηκαν");
  };

  const handleEnableAll = () => {
    const allEnabled = Object.fromEntries(
      Object.keys(securitySettings).map(key => [key, true])
    ) as typeof securitySettings;
    
    setSecuritySettings(allEnabled);
    toast.info("Όλες οι λειτουργίες ασφαλείας ενεργοποιήθηκαν");
  };

  const handleDisableAll = () => {
    const allDisabled = Object.fromEntries(
      Object.keys(securitySettings).map(key => [key, false])
    ) as typeof securitySettings;
    
    setSecuritySettings(allDisabled);
    toast.info("Όλες οι λειτουργίες ασφαλείας απενεργοποιήθηκαν");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Κύριες Ρυθμίσεις Ασφαλείας Πλατφόρμας</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          Ελέγξτε τις κύριες ρυθμίσεις ασφαλείας της πλατφόρμας
        </CardDescription>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-6">
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Επιλογές Ενεργοποίησης</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDisableAll}>Απενεργοποίηση Όλων</Button>
                <Button variant="outline" size="sm" onClick={handleEnableAll}>Ενεργοποίηση Όλων</Button>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Λειτουργία Ασφαλείας</TableHead>
                  <TableHead>Περιγραφή</TableHead>
                  <TableHead className="w-[100px]">Κατάσταση</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Row Level Security</TableCell>
                  <TableCell>Περιορισμός πρόσβασης δεδομένων βάσει χρήστη</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.rowLevelSecurity}
                      onCheckedChange={() => handleToggle('rowLevelSecurity')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Κρυπτογράφηση API Keys</TableCell>
                  <TableCell>Κρυπτογράφηση κλειδιών API στη βάση δεδομένων</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.apiKeyEncryption}
                      onCheckedChange={() => handleToggle('apiKeyEncryption')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Επαλήθευση Δύο Παραγόντων</TableCell>
                  <TableCell>Απαίτηση κωδικών μίας χρήσης για είσοδο</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={() => handleToggle('twoFactorAuth')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Όρια Συναλλαγών</TableCell>
                  <TableCell>Περιορισμοί ποσών και συχνότητας συναλλαγών</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.transactionLimits}
                      onCheckedChange={() => handleToggle('transactionLimits')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Εγκεκριμένες Διευθύνσεις</TableCell>
                  <TableCell>Περιορισμός συναλλαγών σε εγκεκριμένες διευθύνσεις</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.approvedAddresses}
                      onCheckedChange={() => handleToggle('approvedAddresses')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Γεωγραφικοί Περιορισμοί</TableCell>
                  <TableCell>Περιορισμός πρόσβασης βάσει τοποθεσίας</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.geoRestrictions}
                      onCheckedChange={() => handleToggle('geoRestrictions')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Προηγμένη Αυθεντικοποίηση Email</TableCell>
                  <TableCell>Απαίτηση επιβεβαίωσης email και ενισχυμένη ασφάλεια</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.advancedEmailAuth}
                      onCheckedChange={() => handleToggle('advancedEmailAuth')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Βιομετρική Αυθεντικοποίηση</TableCell>
                  <TableCell>Χρήση δακτυλικών αποτυπωμάτων ή αναγνώρισης προσώπου</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.biometricAuth}
                      onCheckedChange={() => handleToggle('biometricAuth')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Social Authentication</TableCell>
                  <TableCell>Σύνδεση μέσω Google, Facebook κ.λπ.</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.socialAuth}
                      onCheckedChange={() => handleToggle('socialAuth')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Καθυστερήσεις Συναλλαγών</TableCell>
                  <TableCell>Χρόνος αναμονής για την εκτέλεση συναλλαγών</TableCell>
                  <TableCell>
                    <Switch 
                      checked={securitySettings.transactionDelays}
                      onCheckedChange={() => handleToggle('transactionDelays')}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-4">
              <Label className="text-sm text-muted-foreground mb-2 block">
                Σημείωση: Αυτές οι ρυθμίσεις θα εφαρμοστούν όταν η πλατφόρμα περάσει σε πλήρη λειτουργία
              </Label>
              
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="disclaimer" />
                <Label htmlFor="disclaimer" className="text-sm">
                  Κατανοώ ότι η απενεργοποίηση των λειτουργιών ασφαλείας μπορεί να αυξήσει το ρίσκο
                </Label>
              </div>
              
              <Button onClick={handleSaveSettings} className="w-full">
                Αποθήκευση Ρυθμίσεων
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
