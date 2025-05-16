
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
  KeyRound,
  Activity,
  LucideIcon,
  Eye,
  ServerCrash,
  Clock
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/use-language";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
}

const FeatureCard = ({ title, description, icon: Icon, iconColor = "text-primary" }: FeatureCardProps) => (
  <Card className="bg-muted/30 border">
    <CardHeader className="pb-1 pt-3">
      <CardTitle className="text-sm flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-xs">
      {description}
    </CardContent>
  </Card>
);

export function SystemProtectionGuide() {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 space-y-6">
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Σύστημα Προστασίας & Αποκατάστασης</h3>
          <Badge variant="outline" className="text-xs">v2.5</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Η εφαρμογή διαθέτει προηγμένο σύστημα προστασίας που αποτρέπει και επιδιορθώνει πιθανά προβλήματα αυτόματα.
          Όλα τα δεδομένα προστατεύονται με προηγμένες μεθόδους κρυπτογράφησης και αποθηκεύονται με ασφάλεια.
        </p>
      </section>
      
      <Alert className="bg-amber-500/10 border-amber-500/50">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle>Λειτουργία Έκτακτης Ανάγκης</AlertTitle>
        <AlertDescription className="mt-2">
          <p>Σε περίπτωση σοβαρών προβλημάτων με την εφαρμογή, πατήστε <kbd className="px-2 py-1 rounded bg-muted border">Alt+Shift+R</kbd> για να ενεργοποιήσετε τη λειτουργία επαναφοράς έκτακτης ανάγκης.</p>
          <p className="text-xs mt-1">Για τεχνική υποστήριξη, επικοινωνήστε με την ομάδα υποστήριξης μέσω email στο support@solanatrade.app</p>
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
                  <li>Πριν από εγκατάσταση ενημερώσεων συστήματος</li>
                  <li>Πριν από σημαντικές αλλαγές στις ρυθμίσεις των bots</li>
                </ul>
                <p className="text-sm mt-2">
                  <strong>Τεχνική Λειτουργία:</strong> Κάθε αντίγραφο ασφαλείας αποθηκεύεται σε κρυπτογραφημένη μορφή με μοναδικό αναγνωριστικό και χρονοσήμανση. Τα δεδομένα αποθηκεύονται τοπικά με πλεονασμό σε multiple storage backends.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Χειροκίνητα Αντίγραφα</h4>
                <p className="text-sm text-muted-foreground">
                  Μπορείτε να δημιουργήσετε χειροκίνητα αντίγραφα ασφαλείας με τους εξής τρόπους:
                </p>
                <ul className="list-disc list-inside text-sm mt-1">
                  <li>Μέσω της κονσόλας: <code>window.siteBackup.create()</code></li>
                  <li>Από το μενού διαχείρισης στις "Ρυθμίσεις &gt; Ασφάλεια"</li>
                  <li>Χρησιμοποιώντας την εντολή <code>/backup create</code> στο command prompt</li>
                  <li>Από το μενού περιβάλλοντος με δεξί κλικ σε οποιαδήποτε κενή περιοχή της εφαρμογής</li>
                </ul>
                <p className="text-sm mt-2">
                  <strong>Συμβουλή:</strong> Συνιστάται η δημιουργία χειροκίνητου αντιγράφου πριν από σημαντικές αλλαγές στις ρυθμίσεις των bots ή του API Vault.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Διαχείριση Αντιγράφων</h4>
                <p className="text-sm text-muted-foreground">
                  Το σύστημα διατηρεί τα τελευταία 10 αντίγραφα ασφαλείας, τα οποία μπορείτε να διαχειριστείτε από τις "Ρυθμίσεις &gt; Ασφάλεια &gt; Αντίγραφα Ασφαλείας". 
                </p>
                <p className="text-sm mt-1">
                  <strong>Προηγμένες λειτουργίες:</strong>
                </p>
                <ul className="list-disc list-inside text-sm mt-1">
                  <li>Εξαγωγή αντιγράφων σε εξωτερικό αρχείο</li>
                  <li>Εισαγωγή αντιγράφων από αρχείο</li>
                  <li>Σύγκριση περιεχομένων μεταξύ διαφορετικών σημείων επαναφοράς</li>
                  <li>Επιλεκτική επαναφορά συγκεκριμένων στοιχείων</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="health-monitor">
          <AccordionTrigger className="flex gap-2 items-center font-medium">
            <Activity className="h-4 w-4 text-primary" />
            <span>Σύστημα Παρακολούθησης Υγείας</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-6">
              <p className="text-sm text-muted-foreground">
                Το SiteHealthMonitor εκτελεί αυτόματους ελέγχους για να εξασφαλίσει την ορθή λειτουργία της εφαρμογής και την προστασία των δεδομένων σας.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-1">Αυτοματοποιημένοι Έλεγχοι:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FeatureCard 
                    title="Έλεγχος DOM Δομής" 
                    description="Επαλήθευση ύπαρξης και λειτουργικότητας κρίσιμων στοιχείων DOM για την αποτροπή προβλημάτων διεπαφής."
                    icon={Eye}
                  />
                  <FeatureCard 
                    title="Έλεγχος API Συνδεσιμότητας" 
                    description="Έλεγχος συνδεσιμότητας με κρίσιμα API endpoints και υπηρεσίες για την ομαλή λειτουργία της εφαρμογής."
                    icon={ServerCrash}
                  />
                  <FeatureCard 
                    title="Ανίχνευση Μοτίβων Σφαλμάτων" 
                    description="Προηγμένοι αλγόριθμοι για την ανίχνευση επαναλαμβανόμενων ή συσχετισμένων σφαλμάτων."
                    icon={AlertTriangle}
                    iconColor="text-amber-500"
                  />
                  <FeatureCard 
                    title="Παρακολούθηση Επιδόσεων" 
                    description="Συνεχής παρακολούθηση χρόνων απόκρισης και απόδοσης για τη διατήρηση βέλτιστης εμπειρίας χρήστη."
                    icon={Clock}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-1">Διαδικασία Ελέγχου Υγείας:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Έλεγχος σημαντικών στοιχείων διεπαφής χρήστη</li>
                  <li>Έλεγχος συνδεσιμότητας με τα απαιτούμενα API endpoints</li>
                  <li>Επαλήθευση ακεραιότητας των τοπικά αποθηκευμένων δεδομένων</li>
                  <li>Έλεγχος συγχρονισμού με απομακρυσμένες υπηρεσίες</li>
                  <li>Αξιολόγηση επιδόσεων και αναγνώριση σημείων βελτιστοποίησης</li>
                  <li>Έλεγχος για ενημερώσεις και νέες εκδόσεις</li>
                </ol>
              </div>
              
              <div className="bg-muted rounded p-3">
                <h4 className="font-medium text-sm mb-1">Χειροκίνητος Έλεγχος Υγείας:</h4>
                <p className="text-sm">Μπορείτε να εκτελέσετε χειροκίνητο έλεγχο υγείας με τους εξής τρόπους:</p>
                <ul className="list-disc list-inside text-xs mt-1">
                  <li>Κονσόλα: <code>window.siteHealthMonitor.runCheck()</code></li>
                  <li>Command Prompt: <code>/health check</code></li>
                  <li>Από το μενού "Ρυθμίσεις &gt; Διαγνωστικά &gt; Έλεγχος Υγείας"</li>
                </ul>
              </div>

              <Alert className="bg-primary/10 border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm">Σε πραγματικό χρόνο</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  Το σύστημα παρακολούθησης υγείας λειτουργεί σε πραγματικό χρόνο και μπορεί να προειδοποιήσει για πιθανά προβλήματα πριν αυτά επηρεάσουν τη λειτουργικότητα της εφαρμογής.
                </AlertDescription>
              </Alert>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="auto-recovery">
          <AccordionTrigger className="flex gap-2 items-center font-medium">
            <RefreshCcw className="h-4 w-4 text-primary" />
            <span>Σύστημα Αυτόματης Αποκατάστασης</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-6">
              <p className="text-sm text-muted-foreground">
                Το AutoRecovery ενεργοποιείται αυτόματα όταν εντοπιστούν κρίσιμα σφάλματα που θα μπορούσαν να διακόψουν τη λειτουργία της εφαρμογής. Λειτουργεί σε συνδυασμό με το σύστημα αντιγράφων ασφαλείας για την αποκατάσταση της εφαρμογής σε λειτουργική κατάσταση.
              </p>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Στάδια Αυτόματης Αποκατάστασης:</h4>
                <div className="relative border-l-2 border-primary/30 pl-4 pb-2 space-y-4">
                  <div>
                    <div className="flex items-center">
                      <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                        <span className="text-[10px]">1</span>
                      </div>
                      <h5 className="font-medium text-sm">Εντοπισμός κρίσιμου σφάλματος</h5>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      Το σύστημα αναγνωρίζει σφάλματα που εμποδίζουν την ομαλή λειτουργία της εφαρμογής, όπως αποτυχίες στην εμφάνιση του περιβάλλοντος χρήστη, σφάλματα δεδομένων ή κατάρρευση σύνδεσης δικτύου.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                        <span className="text-[10px]">2</span>
                      </div>
                      <h5 className="font-medium text-sm">Διαγνωστικός Έλεγχος</h5>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      Εκτελείται λεπτομερής ανάλυση για τον προσδιορισμό της πηγής του προβλήματος και την αξιολόγηση της σοβαρότητάς του. Τα αποτελέσματα καταγράφονται για μελλοντική ανάλυση.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                        <span className="text-[10px]">3</span>
                      </div>
                      <h5 className="font-medium text-sm">Προσπάθεια επιδιόρθωσης</h5>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      Το σύστημα επιχειρεί διάφορες στρατηγικές επιδιόρθωσης, ανάλογα με τον τύπο του σφάλματος: 
                      επαναφόρτωση δεδομένων, επαναρύθμιση συστατικών, επανασύνδεση με υπηρεσίες API ή επαναδημιουργία κατεστραμμένων δομών δεδομένων.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                        <span className="text-[10px]">4</span>
                      </div>
                      <h5 className="font-medium text-sm">Επαναφορά από αντίγραφο ασφαλείας</h5>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      Εάν οι αρχικές προσπάθειες επιδιόρθωσης αποτύχουν, το σύστημα επαναφέρει αυτόματα την εφαρμογή από το πιο πρόσφατο αντίγραφο ασφαλείας που ήταν γνωστό ότι λειτουργούσε σωστά.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                        <span className="text-[10px]">5</span>
                      </div>
                      <h5 className="font-medium text-sm">Επαλήθευση και αναφορά</h5>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      Μετά την αποκατάσταση, το σύστημα επαληθεύει ότι η εφαρμογή λειτουργεί κανονικά και παρέχει αναφορά για τη διαδικασία αποκατάστασης, προτείνοντας ενέργειες για την αποφυγή μελλοντικών προβλημάτων.
                    </p>
                  </div>
                </div>
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
                <Alert className="mt-3 bg-muted">
                  <AlertTitle className="text-sm">Προηγμένη Επαναφορά</AlertTitle>
                  <AlertDescription className="text-xs">
                    Για προηγμένες επιλογές επαναφοράς, χρησιμοποιήστε την εντολή <code>window.siteBackup.recover(options)</code> στην κονσόλα, όπου το options είναι ένα αντικείμενο με επιπλέον παραμέτρους.
                  </AlertDescription>
                </Alert>
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
            <div className="space-y-4 pl-6">
              <p className="text-sm text-muted-foreground">
                Το σύστημα διαχείρισης σφαλμάτων συλλέγει, αναλύει και αναφέρει σφάλματα για την αποτροπή και επίλυση προβλημάτων.
                Κάθε σφάλμα καταγράφεται με λεπτομέρειες για τη διευκόλυνση της διάγνωσης και της επίλυσης.
              </p>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Συλλογή Σφαλμάτων:</h4>
                <p className="text-sm">
                  Όλα τα σφάλματα συλλέγονται από το <code>errorCollector</code> και κατηγοριοποιούνται με βάση:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-muted p-2 rounded">
                    <h5 className="text-xs font-medium">Σοβαρότητα</h5>
                    <ul className="list-disc list-inside text-xs mt-1">
                      <li>Χαμηλή - Μικρά UI προβλήματα</li>
                      <li>Μεσαία - Περιορισμένη λειτουργικότητα</li>
                      <li>Υψηλή - Σημαντική απώλεια λειτουργικότητας</li>
                      <li>Κρίσιμη - Διακοπή λειτουργίας της εφαρμογής</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <h5 className="text-xs font-medium">Προέλευση</h5>
                    <ul className="list-disc list-inside text-xs mt-1">
                      <li>UI - Διεπαφή χρήστη</li>
                      <li>Δίκτυο - Συνδέσεις API και δικτύου</li>
                      <li>Δεδομένα - Διαχείριση και αποθήκευση</li>
                      <li>Συστήματα Bots - Λειτουργίες αυτοματισμού</li>
                      <li>Συστήματα - Core λειτουργικότητα</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-1">Προηγμένες Λειτουργίες:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FeatureCard 
                    title="Αυτόματη Ανίχνευση Μοτίβων" 
                    description="Το σύστημα αναλύει τα σφάλματα για να αναγνωρίσει μοτίβα και τάσεις που μπορεί να υποδεικνύουν συστημικά προβλήματα."
                    icon={Activity}
                  />
                  <FeatureCard 
                    title="Πρόληψη Επαναλαμβανόμενων Σφαλμάτων" 
                    description="Τεχνικές προληπτικής αντιμετώπισης για την αποφυγή επανάληψης γνωστών σφαλμάτων."
                    icon={Shield}
                  />
                  <FeatureCard 
                    title="Λεπτομερή Αρχεία Καταγραφής" 
                    description="Εκτενής καταγραφή με πλήρεις στοίβες κλήσεων και περιβαλλοντικά δεδομένα για ακριβή διάγνωση."
                    icon={FileText}
                  />
                  <FeatureCard 
                    title="Αναφορά Σφαλμάτων" 
                    description="Αυτόματη αναφορά κρίσιμων σφαλμάτων στην ομάδα υποστήριξης (όταν είναι ενεργοποιημένη στις ρυθμίσεις)."
                    icon={AlertTriangle}
                    iconColor="text-amber-500"
                  />
                </div>
              </div>
              
              <div className="mt-2">
                <div className="bg-muted p-3 rounded">
                  <p className="text-sm font-medium">Για προβολή όλων των καταγεγραμμένων σφαλμάτων:</p>
                  <code className="text-xs bg-muted/50 p-1 rounded block mt-1">window.errorCollector.getErrors()</code>
                  <p className="text-sm font-medium mt-3">Για προχωρημένη φιλτραρισμένη προβολή σφαλμάτων:</p>
                  <code className="text-xs bg-muted/50 p-1 rounded block mt-1 whitespace-pre-wrap">
                    {`window.errorCollector.getErrors({
  severity: 'high',  // 'low', 'medium', 'high', 'critical'
  source: 'network', // 'ui', 'network', 'data', 'bots', 'system'
  timeFrame: '24h'   // '1h', '24h', '7d', 'all'
})`}
                  </code>
                </div>
              </div>
              
              <Alert className="bg-primary/10 border-primary/20">
                <RefreshCcw className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm">Συνεχής Βελτίωση</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  Το σύστημα διαχείρισης σφαλμάτων εξελίσσεται συνεχώς με βάση τα δεδομένα που συλλέγει, βελτιώνοντας την ανθεκτικότητα και την αξιοπιστία της εφαρμογής με την πάροδο του χρόνου.
                </AlertDescription>
              </Alert>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="security-features">
          <AccordionTrigger className="flex gap-2 items-center font-medium">
            <KeyRound className="h-4 w-4 text-primary" />
            <span>Χαρακτηριστικά Ασφαλείας</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-6">
              <p className="text-sm text-muted-foreground">
                Η εφαρμογή διαθέτει προηγμένα χαρακτηριστικά ασφαλείας για την προστασία των δεδομένων και της λειτουργικότητάς της. 
                Όλες οι ευαίσθητες πληροφορίες κρυπτογραφούνται και τα συστήματα παρακολουθούνται συνεχώς για ύποπτη δραστηριότητα.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="bg-muted/30 border">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      API Vault
                    </CardTitle>
                    <CardDescription className="text-xs">Ασφαλής αποθήκευση κλειδιών</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    <p>
                      Ασφαλής αποθήκευση και διαχείριση κλειδιών API με κρυπτογράφηση και αυστηρό έλεγχο πρόσβασης.
                    </p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Κρυπτογράφηση AES-256</li>
                      <li>Προστασία κλειδιών με κύριο κωδικό</li>
                      <li>Αυτόματο κλείδωμα μετά από αδράνεια</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30 border">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4 text-primary" />
                      Προστασία Συναλλαγών
                    </CardTitle>
                    <CardDescription className="text-xs">Ασφάλεια blockchain συναλλαγών</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    <p>
                      Έλεγχοι ασφαλείας για κάθε συναλλαγή στο blockchain με επαλήθευση και προστασία από κακόβουλες ενέργειες.
                    </p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Επαλήθευση διεύθυνσης παραλήπτη</li>
                      <li>Προστασία από διπλές συναλλαγές</li>
                      <li>Έλεγχος μέγιστου ποσού συναλλαγής</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
