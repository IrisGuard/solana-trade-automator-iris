
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface AddCommandFormProps {
  newCommand: string;
  setNewCommand: (command: string) => void;
  newDescription: string;
  setNewDescription: (description: string) => void;
  handleAddCommand: () => void;
  setShowAddCommand: (show: boolean) => void;
}

export function AddCommandForm({
  newCommand,
  setNewCommand,
  newDescription,
  setNewDescription,
  handleAddCommand,
  setShowAddCommand
}: AddCommandFormProps) {
  return (
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
  );
}
