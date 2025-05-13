
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Settings() {
  const handleSaveChanges = () => {
    toast.success("Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Γενικά</TabsTrigger>
          <TabsTrigger value="account">Λογαριασμός</TabsTrigger>
          <TabsTrigger value="notifications">Ειδοποιήσεις</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Γενικές Ρυθμίσεις</CardTitle>
              <CardDescription>
                Προσαρμόστε τις προτιμήσεις εμφάνισης
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Σκούρο θέμα</Label>
                  <div className="text-sm text-muted-foreground">
                    Ενεργοποίηση ή απενεργοποίηση σκούρου θέματος
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Συμπαγής προβολή</Label>
                  <div className="text-sm text-muted-foreground">
                    Εμφάνιση περισσότερων πληροφοριών σε λιγότερο χώρο
                  </div>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Ζώνη ώρας</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Επιλέξτε ζώνη ώρας" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    <SelectItem value="est">EST (GMT-5)</SelectItem>
                    <SelectItem value="pst">PST (GMT-8)</SelectItem>
                    <SelectItem value="local">Χρήση τοπικής ζώνης ώρας</SelectItem>
                    <SelectItem value="athens">Αθήνα (GMT+2/GMT+3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Νόμισμα εμφάνισης</Label>
                <Select defaultValue="eur">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Επιλέξτε νόμισμα" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Αποθήκευση</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Στοιχεία προφίλ</CardTitle>
              <CardDescription>
                Διαχειριστείτε τις πληροφορίες του λογαριασμού σας
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Όνομα</Label>
                <Input id="name" defaultValue="Solana Trader" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Διεύθυνση Email</Label>
                <Input id="email" type="email" defaultValue="trader@example.com" />
              </div>
              <Separator />
              <div>
                <h3 className="mb-4 text-lg font-medium">Ασφάλεια</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Τρέχων Κωδικός</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div />
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Νέος Κωδικός</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Επιβεβαίωση Νέου Κωδικού</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Αποθήκευση</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Προτιμήσεις ειδοποιήσεων</CardTitle>
              <CardDescription>
                Διαμορφώστε τον τρόπο λήψης ειδοποιήσεων
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Ειδοποιήσεις συναλλαγών</h3>
              
              <div className="space-y-4">
                <NotificationSetting
                  title="Εκτέλεση συναλλαγής"
                  description="Λήψη ειδοποιήσεων όταν τα bots εκτελούν συναλλαγές"
                  defaultChecked={true}
                />
                
                <NotificationSetting
                  title="Ολοκλήρωση εντολής"
                  description="Λήψη ειδοποιήσεων όταν οι εντολές ολοκληρώνονται"
                  defaultChecked={true}
                />
                
                <NotificationSetting
                  title="Ακύρωση εντολής"
                  description="Λήψη ειδοποιήσεων όταν οι εντολές ακυρώνονται"
                  defaultChecked={false}
                />
                
                <NotificationSetting
                  title="Ειδοποιήσεις τιμών"
                  description="Λήψη ειδοποιήσεων για μεταβολές τιμών"
                  defaultChecked={true}
                />
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="notification-channel">Κανάλι ειδοποιήσεων</Label>
                  <Select defaultValue="both">
                    <SelectTrigger id="notification-channel">
                      <SelectValue placeholder="Επιλέξτε κανάλι" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Email και εφαρμογή</SelectItem>
                      <SelectItem value="email">Μόνο Email</SelectItem>
                      <SelectItem value="browser">Μόνο εφαρμογή</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Αποθήκευση</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface NotificationSettingProps {
  title: string;
  description: string;
  defaultChecked: boolean;
}

const NotificationSetting = ({ title, description, defaultChecked }: NotificationSettingProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{title}</Label>
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
};
