
import { useState, useEffect } from "react";
import { useErrorReporting } from "@/hooks/useErrorReporting";

export function useHelpPanelState(isOpen: boolean, onClose: () => void) {
  const [activeTab, setActiveTab] = useState("commands");
  const [newCommand, setNewCommand] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showAddCommand, setShowAddCommand] = useState(false);
  const { reportError } = useErrorReporting();

  // Handle adding a new command
  const handleAddCommand = () => {
    if (!newCommand || !newDescription) return;
    
    try {
      // Logic for saving new commands to a database would go here
      console.log("Προσθήκη νέας εντολής:", { command: newCommand, description: newDescription });
      setNewCommand("");
      setNewDescription("");
      setShowAddCommand(false);
    } catch (error) {
      reportError(error as Error, {
        component: "HelpPanel",
        source: "handleAddCommand",
        severity: "low",
        showToast: true,
        toastTitle: "Αποτυχία προσθήκης εντολής"
      });
    }
  };

  // Log help usage
  useEffect(() => {
    if (isOpen) {
      console.log("Άνοιγμα πάνελ βοήθειας, ενεργή καρτέλα:", activeTab);
    }
  }, [isOpen, activeTab]);

  // Close panel with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return {
    activeTab,
    setActiveTab,
    newCommand,
    setNewCommand,
    newDescription,
    setNewDescription,
    showAddCommand,
    setShowAddCommand,
    handleAddCommand
  };
}
