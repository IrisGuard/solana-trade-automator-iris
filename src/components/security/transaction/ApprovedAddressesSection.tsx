
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTransactionSecurity } from "./useTransactionSecurity";
import { Loader2 } from "lucide-react";

export function ApprovedAddressesSection() {
  const { 
    approvedAddressesEnabled, 
    approvedAddresses, 
    isLoading, 
    updateWhitelistOnly,
    addApprovedAddress, 
    removeApprovedAddress 
  } = useTransactionSecurity();
  
  const [newAddress, setNewAddress] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleToggle = (checked: boolean) => {
    updateWhitelistOnly(checked);
  };
  
  const handleAddAddress = async () => {
    if (!newAddress) return;
    
    setIsSubmitting(true);
    try {
      const success = await addApprovedAddress(newAddress, newDescription);
      if (success) {
        setNewAddress("");
        setNewDescription("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveAddress = (addressId: string) => {
    removeApprovedAddress(addressId);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Εγκεκριμένες Διευθύνσεις</h3>
      <p className="text-sm text-muted-foreground">
        Επιτρέψτε συναλλαγές μόνο με συγκεκριμένες διευθύνσεις πορτοφολιών
      </p>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Χρήση Λίστας Εγκεκριμένων Διευθύνσεων</h4>
          <p className="text-xs text-muted-foreground">Περιορισμός συναλλαγών μόνο σε εγκεκριμένες διευθύνσεις</p>
        </div>
        <Switch 
          checked={approvedAddressesEnabled} 
          onCheckedChange={handleToggle} 
          disabled={isLoading}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Διεύθυνση</TableHead>
              <TableHead>Περιγραφή</TableHead>
              <TableHead className="w-24">Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : approvedAddresses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                  Δεν έχουν προστεθεί εγκεκριμένες διευθύνσεις
                </TableCell>
              </TableRow>
            ) : (
              approvedAddresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell className="font-mono text-xs">
                    {address.address.length > 10 ? 
                      `${address.address.slice(0, 5)}...${address.address.slice(-5)}` : 
                      address.address
                    }
                  </TableCell>
                  <TableCell>{address.description || "—"}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveAddress(address.id!)}
                    >
                      Διαγραφή
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Εισάγετε διεύθυνση πορτοφολιού" 
          className="flex-1"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          disabled={isSubmitting}
        />
        <Input 
          placeholder="Περιγραφή (προαιρετικά)" 
          className="flex-1"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={isSubmitting}
        />
        <Button 
          onClick={handleAddAddress} 
          disabled={!newAddress || isSubmitting}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Προσθήκη
        </Button>
      </div>
    </div>
  );
}
