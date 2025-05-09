import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const SessionsCard = () => {
  // Mock data for active sessions
  const activeSessions = [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "Athens, Greece",
      ip: "85.73.xxx.xxx",
      lastActive: "Τώρα",
      isCurrent: true
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "Athens, Greece",
      ip: "85.73.xxx.xxx",
      lastActive: "2 ώρες πριν",
      isCurrent: false
    },
    {
      id: "3",
      device: "Firefox on macOS",
      location: "Thessaloniki, Greece",
      ip: "94.68.xxx.xxx",
      lastActive: "1 ημέρα πριν",
      isCurrent: false
    }
  ];

  // Mock data for trusted devices
  const trustedDevices = [
    {
      id: "1",
      name: "iPhone 13 Pro",
      lastUsed: "Σήμερα",
      dateAdded: "15/03/2023"
    },
    {
      id: "2",
      name: "MacBook Pro",
      lastUsed: "Χθες",
      dateAdded: "10/01/2023"
    },
    {
      id: "3",
      name: "Windows PC",
      lastUsed: "Τώρα",
      dateAdded: "05/05/2023"
    }
  ];

  // Mock data for login history
  const loginHistory = [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "Athens, Greece",
      ip: "85.73.xxx.xxx",
      time: "Σήμερα, 14:32",
      status: "success"
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "Athens, Greece",
      ip: "85.73.xxx.xxx",
      time: "Σήμερα, 12:15",
      status: "success"
    },
    {
      id: "3",
      device: "Unknown Device",
      location: "Sofia, Bulgaria",
      ip: "78.90.xxx.xxx",
      time: "Χθες, 23:45",
      status: "failed"
    },
    {
      id: "4",
      device: "Firefox on macOS",
      location: "Thessaloniki, Greece",
      ip: "94.68.xxx.xxx",
      time: "Χθες, 18:20",
      status: "success"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Περίοδοι Σύνδεσης & Συσκευές</CardTitle>
        </div>
        <CardDescription>Διαχειριστείτε τις ενεργές συνδέσεις στο λογαριασμό σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Ενεργές Συνδέσεις</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Συσκευή</TableHead>
                <TableHead>Τοποθεσία</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Τελευταία Δραστηριότητα</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    {session.device}
                    {session.isCurrent && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Τρέχουσα
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{session.ip}</TableCell>
                  <TableCell>{session.lastActive}</TableCell>
                  <TableCell className="text-right">
                    {!session.isCurrent && (
                      <Button variant="outline" size="sm">
                        Τερματισμός
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-2 flex justify-end">
            <Button variant="destructive">Τερματισμός Όλων των Άλλων Συνδέσεων</Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-3">Αξιόπιστες Συσκευές</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Οι συσκευές που έχετε ορίσει ως αξιόπιστες δεν απαιτούν επαλήθευση δύο παραγόντων σε κάθε σύνδεση.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Συσκευή</TableHead>
                <TableHead>Τελευταία Χρήση</TableHead>
                <TableHead>Προστέθηκε</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trustedDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.lastUsed}</TableCell>
                  <TableCell>{device.dateAdded}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Αφαίρεση
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Ιστορικό Συνδέσεων</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle aria-label="Toggle suspicious logins">
                    Ύποπτες Μόνο
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Εμφάνιση μόνο των ύποπτων προσπαθειών σύνδεσης</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="recent">
              <AccordionTrigger>Πρόσφατες Συνδέσεις</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Συσκευή</TableHead>
                      <TableHead>Τοποθεσία</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Χρόνος</TableHead>
                      <TableHead>Κατάσταση</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginHistory.map((login) => (
                      <TableRow key={login.id}>
                        <TableCell className="font-medium">{login.device}</TableCell>
                        <TableCell>{login.location}</TableCell>
                        <TableCell>{login.ip}</TableCell>
                        <TableCell>{login.time}</TableCell>
                        <TableCell>
                          {login.status === "success" ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Επιτυχής
                            </span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                              Αποτυχία
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline">Προβολή Πλήρους Ιστορικού</Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ρυθμίσεις Ασφαλείας Συνδέσεων</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ειδοποιήσεις Νέων Συνδέσεων</p>
              <p className="text-sm text-muted-foreground">Λήψη ειδοποιήσεων για νέες συνδέσεις στο λογαριασμό σας</p>
            </div>
            <Toggle defaultPressed>Ενεργό</Toggle>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Αυτόματο Κλείδωμα Αδράνειας</p>
              <p className="text-sm text-muted-foreground">Αυτόματη αποσύνδεση μετά από 30 λεπτά αδράνειας</p>
            </div>
            <Toggle>Ενεργό</Toggle>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Φραγή Ύποπτων Συνδέσεων</p>
              <p className="text-sm text-muted-foreground">Αυτόματη φραγή συνδέσεων από ασυνήθιστες τοποθεσίες</p>
            </div>
            <Toggle defaultPressed>Ενεργό</Toggle>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
