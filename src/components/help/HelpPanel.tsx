
import React from "react";
import {
  Drawer,
  DrawerContent
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { HelpPanelHeader } from "./panel/HelpPanelHeader";
import { HelpPanelFooter } from "./panel/HelpPanelFooter";
import { TabContent } from "./panel/TabContent";
import { AddCommandForm } from "./panel/AddCommandForm";
import { useHelpPanelState } from "./panel/useHelpPanelState";

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  const {
    activeTab,
    setActiveTab,
    newCommand,
    setNewCommand,
    newDescription,
    setNewDescription,
    showAddCommand,
    setShowAddCommand,
    handleAddCommand
  } = useHelpPanelState(isOpen, onClose);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="max-h-[85vh] fixed bottom-0 left-0 right-0 rounded-t-lg">
        <div className="mx-auto w-full max-w-4xl">
          <HelpPanelHeader onClose={onClose} />

          <div className="w-full">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <div className="flex space-x-2">
                <Button 
                  variant={activeTab === "commands" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("commands")}
                  className="flex items-center gap-2"
                >
                  <span className="h-4 w-4" />
                  Εντολές
                </Button>
                <Button 
                  variant={activeTab === "guide" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("guide")}
                  className="flex items-center gap-2"
                >
                  <span className="h-4 w-4" />
                  Οδηγός Πλατφόρμας
                </Button>
                <Button 
                  variant={activeTab === "documentation" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("documentation")}
                  className="flex items-center gap-2"
                >
                  <span className="h-4 w-4" />
                  Τεκμηρίωση Solana
                </Button>
                <Button 
                  variant={activeTab === "protection" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("protection")}
                  className="flex items-center gap-2"
                >
                  <span className="h-4 w-4" />
                  Προστασία Συστήματος
                </Button>
                <Button 
                  variant={activeTab === "search" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("search")}
                  className="flex items-center gap-2"
                >
                  <span className="h-4 w-4" />
                  Αναζήτηση
                </Button>
              </div>

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
              <AddCommandForm 
                newCommand={newCommand}
                setNewCommand={setNewCommand}
                newDescription={newDescription}
                setNewDescription={setNewDescription}
                handleAddCommand={handleAddCommand}
                setShowAddCommand={setShowAddCommand}
              />
            )}

            <TabContent />
          </div>

          <HelpPanelFooter />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
