
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Search, Plus, BookOpen, ListChecks, Info, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommandList } from "./CommandList";
import { PlatformGuide } from "./PlatformGuide";
import { HelpSearch } from "./HelpSearch";
import { SolanaDocumentation } from "./SolanaDocumentation";

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  const [activeTab, setActiveTab] = useState("commands");
  const [newCommand, setNewCommand] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showAddCommand, setShowAddCommand] = useState(false);
  
  const handleAddCommand = () => {
    // Εδώ θα μπορούσε να προστεθεί λογική για αποθήκευση των νέων εντολών σε μια βάση δεδομένων
    console.log("Προσθήκη νέας εντολής:", { command: newCommand, description: newDescription });
    setNewCommand("");
    setNewDescription("");
    setShowAddCommand(false);
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="max-h-[85vh] fixed bottom-0 left-0 right-0 rounded-t-lg">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-xl font-bold">Βοηθός Πλατφόρμας</DrawerTitle>
              <DrawerClose onClick={onClose} className="rounded-full p-2 hover:bg-muted">
                <X className="h-4 w-4" />
              </DrawerClose>
            </div>
          </DrawerHeader>

          <Tabs 
            defaultValue="commands" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <TabsList>
                <TabsTrigger value="commands" className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Εντολές
                </TabsTrigger>
                <TabsTrigger value="guide" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Οδηγός Πλατφόρμας
                </TabsTrigger>
                <TabsTrigger value="documentation" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Τεκμηρίωση Solana
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Αναζήτηση
                </TabsTrigger>
              </TabsList>

              {activeTab === "commands" && !showAddCommand && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => setShowAddCommand(true)}
                >
                  <Plus className="h-4 w-4" />
                  Προσθήκη εντολής
                </Button>
              )}
            </div>

            {showAddCommand && (
              <div className="p-4 border-b">
                <h3 className="font-medium mb-2">Προσθήκη Νέας Εντολής</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="command" className="text-sm font-medium block mb-1">
                      Εντολή
                    </label>
                    <Input
                      id="command"
                      placeholder="Εισάγετε εντολή"
                      value={newCommand}
                      onChange={(e) => setNewCommand(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="text-sm font-medium block mb-1">
                      Περιγραφή
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Περιγράψτε τη λειτουργία της εντολής"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowAddCommand(false)}>
                      Ακύρωση
                    </Button>
                    <Button onClick={handleAddCommand} disabled={!newCommand || !newDescription}>
                      Προσθήκη
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <ScrollArea className="h-[50vh] overflow-auto">
              <TabsContent value="commands" className="p-0">
                <CommandList />
              </TabsContent>

              <TabsContent value="guide" className="p-0">
                <PlatformGuide />
              </TabsContent>

              <TabsContent value="documentation" className="p-0">
                <SolanaDocumentation />
              </TabsContent>

              <TabsContent value="search" className="p-0">
                <HelpSearch />
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DrawerFooter className="border-t">
            <div className="text-center text-sm text-muted-foreground">
              Για περισσότερες πληροφορίες, επικοινωνήστε με την ομάδα υποστήριξης.
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
