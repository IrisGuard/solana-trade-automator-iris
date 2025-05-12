
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SecurityFeatureRow } from "./SecurityFeatureRow";
import { Button } from "@/components/ui/button";

interface SecuritySetting {
  [key: string]: boolean;
}

interface SecurityTableProps {
  securitySettings: SecuritySetting;
  handleToggle: (setting: string) => void;
  handleEnableAll: () => void;
  handleDisableAll: () => void;
}

export function SecurityTable({ 
  securitySettings, 
  handleToggle, 
  handleEnableAll, 
  handleDisableAll 
}: SecurityTableProps) {
  // Define security features with their descriptions
  const securityFeatures = [
    {
      key: "rowLevelSecurity",
      name: "Row Level Security",
      description: "Περιορισμός πρόσβασης δεδομένων βάσει χρήστη"
    },
    {
      key: "apiKeyEncryption",
      name: "Κρυπτογράφηση API Keys",
      description: "Κρυπτογράφηση κλειδιών API στη βάση δεδομένων"
    },
    {
      key: "twoFactorAuth",
      name: "Επαλήθευση Δύο Παραγόντων",
      description: "Απαίτηση κωδικών μίας χρήσης για είσοδο"
    },
    {
      key: "transactionLimits",
      name: "Όρια Συναλλαγών",
      description: "Περιορισμοί ποσών και συχνότητας συναλλαγών"
    },
    {
      key: "approvedAddresses",
      name: "Εγκεκριμένες Διευθύνσεις",
      description: "Περιορισμός συναλλαγών σε εγκεκριμένες διευθύνσεις"
    },
    {
      key: "geoRestrictions",
      name: "Γεωγραφικοί Περιορισμοί",
      description: "Περιορισμός πρόσβασης βάσει τοποθεσίας"
    },
    {
      key: "advancedEmailAuth",
      name: "Προηγμένη Αυθεντικοποίηση Email",
      description: "Απαίτηση επιβεβαίωσης email και ενισχυμένη ασφάλεια"
    },
    {
      key: "biometricAuth",
      name: "Βιομετρική Αυθεντικοποίηση",
      description: "Χρήση δακτυλικών αποτυπωμάτων ή αναγνώρισης προσώπου"
    },
    {
      key: "socialAuth",
      name: "Social Authentication",
      description: "Σύνδεση μέσω Google, Facebook κ.λπ."
    },
    {
      key: "transactionDelays",
      name: "Καθυστερήσεις Συναλλαγών",
      description: "Χρόνος αναμονής για την εκτέλεση συναλλαγών"
    }
  ];

  return (
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
          {securityFeatures.map((feature) => (
            <SecurityFeatureRow
              key={feature.key}
              name={feature.name}
              description={feature.description}
              isEnabled={securitySettings[feature.key]}
              onToggle={() => handleToggle(feature.key)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
