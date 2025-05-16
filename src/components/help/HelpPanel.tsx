
import React from "react";
import {
  Drawer,
  DrawerContent
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { HelpPanelHeader } from "./panel/HelpPanelHeader";
import { HelpPanelFooter } from "./panel/HelpPanelFooter";
import { HelpPanelTabs } from "./panel/HelpPanelTabs";
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
            <HelpPanelTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showAddCommand={showAddCommand}
              setShowAddCommand={setShowAddCommand}
            />

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
