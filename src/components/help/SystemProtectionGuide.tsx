
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Shield, 
  RefreshCcw, 
  Database, 
  AlertTriangle,
  FileText,
  KeyRound
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/use-language";

export function SystemProtectionGuide() {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 space-y-6">
      <section className="space-y-2">
        <h3 className="text-lg font-medium">Σύστημα Προστασίας & Αποκατάστασης</h3>
        <p className="text-sm text-muted-foreground">
          Η εφαρμογή διαθέτει προηγμένο σύστημα προστασίας που αποτρέπει και επιδιορθώνει πιθανά προβλήματα αυτόματα.
        </p>
      </section>
      
      <Alert className="bg-amber-500/10 border-amber-500/50">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle>Λειτουργία Έκτακτης Ανάγκης</AlertTitle>
        <AlertDescription className="mt-2">
          Σε περίπτωση σοβαρών προβλημάτων με την εφαρμογή, πατήστε <kbd className="px-2 py-1 rounded bg-muted border">Alt+Shift+R</kbd> για να ενεργοποιήσετε τη λειτουργία επαναφοράς έκτακτης ανάγκης.
        </AlertDescription>
      </Alert>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="backups">
          <AccordionTrigger className="flex gap-2 items-center font-medium">
            <Database className="h-4 w-4 text-primary" />
            <span>Σύστημα Αντιγράφων Ασφαλείας</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-6">
              <div>
                <h4 className="font-medium mb-1">Αυτόματα Αντίγραφα</h4>
                <p className="text-sm text-muted-foreground">
                  Το σύστημα δημιουργεί αυτόματα αντίγραφα ασφαλείας της δομής του ιστότοπου στα εξής σημεία:
                </p>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                  <li>Κατά την αρχική φόρτωση της εφαρμογής</li>
                  <li>Μετά από σημαντικές αλλαγές στη δομή της εφαρμογής</li>
                  <li>Περιοδικά κατά τη διάρκεια χρήσης (κάθε 60 λεπτά)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Χειροκίνητα Αντίγραφα</h4>
                <p className="text-sm text-muted-foreground">
                  Μπορείτε να δημιουργήσετε χειροκίνητα αντίγραφα ασφαλείας με τους εξής τρόπους:
                </p>
                <ul className="list-disc list-inside text-sm mt-1">
                  <li>Μέσω της κονσόλας: <code>window.siteBackup.create()</code></li>
                  <li>Από το μενού διαχείρισης στις "Ρυθμίσεις &gt; Ασφάλεια"</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="health-monitor">
          <AccordionTrigger className="flex gap-2 items-center font-medium">
            <Shield className="h-4 w-4 text-primary" />
            <span>Σύστημα Παρακολούθησης Υγείας</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pl-6">
              <p className="text-sm text-muted-foreground">
                Το SiteHealthMonitor εκτελεί αυτόματους ελέγχους για να εξασφαλίσει την ορθή λειτουργία:
              </p>
              <ul className="list-disc list-inside text-sm mt-1">
                <li>Επαλήθευση ύπαρξης κρίσιμων στοιχείων DOM</li>
                <li>Έλεγχος συνδεσιμότητας με τις απαραίτητες υπηρεσίες API</li>
                <li>Ανίχνευση ασυνήθιστων μοτίβων σφαλμάτων</li>
                <li>Παρακολούθηση απόδοσης και χρόνων απόκρισης</li>
              </ul>
              
              <p className="text-sm mt-2">
                Μπορείτε να εκτελέσετε χειροκίνητο έλεγχο υγείας μέσω της κονσόλας: <code>window.siteBackup.check()</code>
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="auto-recovery">
          <AccordionTrigger className="flex gap-2 items-center font-medium">
            <RefreshCcw className="h-4 w-4 text-primary" />
            <span>Σύστημα Αυτόματης Αποκατάστασης</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pl-6">
              <p className="text-sm text-muted-foreground">
                Το AutoRecovery ενεργοποιείται αυτόματα όταν εντοπιστούν κρίσιμα σφάλματα που θα μπορούσαν να διακόψουν τη λειτουργία της εφαρμογής.
              </p>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Στάδια Αποκατάστασης:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Εντοπισμός κρίσιμου σφάλματος</li>
                  <li>Εκτέλεση διαγνωστικών ελέγχων</li>
                  <li>Προσπάθεια αυτόματης διόρθωσης</li>
                  <li>Επαναφορά από αντίγραφο ασφαλείας αν χρειάζεται</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Χειροκίνητη Επαναφορά:</h4>
                <p className="text-sm">
                  Σε περίπτωση που χρειάζεται χειροκίνητη επαναφορά:
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Πατήστε <kbd className="px-2 py-0.5 rounded bg-muted border">Alt+Shift+R</kbd> για να εμφανιστεί το εργαλείο αποκατάστασης</li>
                  <li>Επιλέξτε ένα σημείο επαναφοράς από τη λίστα</li>
                  <li>Πατήστε "Επαναφορά" και περιμένετε την ολοκλήρωση της διαδικασίας</li>
                  <li>Επαληθεύστε τη λειτουργικότητα μετά την επαναφορά</li>
                </ol>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="error-handling">
          <AccordionTrigger className="flex gap-2 items-center font-medium">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span>Σύστημα Διαχείρισης Σφαλμάτων</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pl-6">
              <p className="text-sm text-muted-foreground">
                Το σύστημα διαχείρισης σφαλμάτων συλλέγει, αναλύει και αναφέρει σφάλματα για την αποτροπή και επίλυση προβλημάτων.
              </p>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Συλλογή Σφαλμάτων:</h4>
                <p className="text-sm">
                  Όλα τα σφάλματα συλλέγονται από το <code>errorCollector</code> και κατηγοριοποιούνται με βάση:
                </p>
                <ul className="list-disc list-inside text-sm mt-1">
                  <li>Σοβαρότητα (χαμηλή, μεσαία, υψηλή, κρίσιμη)</li>
                  <li>Προέλευση (UI, δίκτυο, API, κ.λπ.)</li>
                  <li>Συχνότητα εμφάνισης</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Προηγμένες Λειτουργίες:</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>Αυτόματη ανίχνευση μοτίβων σφαλμάτων</li>
                  <li>Πρόληψη επαναλαμβανόμενων σφαλμάτων</li>
                  <li>Λεπτομερή αρχεία καταγραφής σφαλμάτων</li>
                  <li>Αναφορά σφαλμάτων στην ομάδα υποστήριξης (όταν ενεργοποιηθεί)</li>
                </ul>
              </div>
              
              <div className="mt-2">
                <p className="text-sm font-medium">Για προβολή όλων των καταγεγραμμένων σφαλμάτων:</p>
                <code className="text-xs bg-muted p-1 rounded">console.log(errorCollector.getErrors())</code>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="security-features">
          <AccordionTrigger className="flex gap-2 items-center font-medium">
            <KeyRound className="h-4 w-4 text-primary" />
            <span>Χαρακτηριστικά Ασφαλείας</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pl-6">
              <p className="text-sm text-muted-foreground">
                Η εφαρμογή διαθέτει προηγμένα χαρακτηριστικά ασφαλείας για την προστασία των δεδομένων και της λειτουργικότητάς της:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="bg-muted/30 border">
                  <CardHeader className="pb-1 pt-3">
                    <CardTitle className="text-sm">API Vault</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    Ασφαλής αποθήκευση και διαχείριση κλειδιών API με κρυπτογράφηση και αυστηρό έλεγχο πρόσβασης.
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30 border">
                  <CardHeader className="pb-1 pt-3">
                    <CardTitle className="text-sm">Προστασία Συναλλαγών</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    Έλεγχοι ασφαλείας για κάθε συναλλαγή στο blockchain με επαλήθευση και πολλαπλούς ελέγχους.
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30 border">
                  <CardHeader className="pb-1 pt-3">
                    <CardTitle className="text-sm">Αυθεντικοποίηση Multifactor</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    Επιπλέον επίπεδα ασφαλείας για την πρόσβαση στις κρίσιμες λειτουργίες της εφαρμογής.
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30 border">
                  <CardHeader className="pb-1 pt-3">
                    <CardTitle className="text-sm">Παρακολούθηση Συνεδριών</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    Ανίχνευση ύποπτης δραστηριότητας και αυτόματος τερματισμός επικίνδυνων συνεδριών.
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="documentation">
          <AccordionTrigger className="flex gap-2 items-center font-medium">
            <FileText className="h-4 w-4 text-primary" />
            <span>Τεχνική Τεκμηρίωση</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pl-6">
              <p className="text-sm text-muted-foreground">
                Πλήρης τεχνική τεκμηρίωση των συστημάτων προστασίας και ασφαλείας:
              </p>
              
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-xs">
                    <th className="border p-2 text-left">Στοιχείο</th>
                    <th className="border p-2 text-left">Περιγραφή</th>
                    <th className="border p-2 text-left">API</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr>
                    <td className="border p-2">SiteBackupService</td>
                    <td className="border p-2">Διαχείριση αντιγράφων ασφαλείας της δομής του ιστότοπου</td>
                    <td className="border p-2"><code>window.siteBackup</code></td>
                  </tr>
                  <tr>
                    <td className="border p-2">SiteHealthMonitor</td>
                    <td className="border p-2">Παρακολούθηση της υγείας της εφαρμογής</td>
                    <td className="border p-2"><code>SiteHealthMonitor.checkHealth()</code></td>
                  </tr>
                  <tr>
                    <td className="border p-2">AutoRecovery</td>
                    <td className="border p-2">Αυτόματη αποκατάσταση κρίσιμων σφαλμάτων</td>
                    <td className="border p-2"><code>AutoRecovery.attemptRecovery()</code></td>
                  </tr>
                  <tr>
                    <td className="border p-2">ErrorCollector</td>
                    <td className="border p-2">Συλλογή και ανάλυση σφαλμάτων</td>
                    <td className="border p-2"><code>errorCollector.captureError()</code></td>
                  </tr>
                </tbody>
              </table>
              
              <p className="text-sm mt-2">
                Για πλήρη πρόσβαση στην τεκμηρίωση, επισκεφθείτε τη σελίδα "Ρυθμίσεις &gt; Τεχνική Τεκμηρίωση" ή συμβουλευτείτε τα σχόλια στον πηγαίο κώδικα.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
    </div>
  );
}

