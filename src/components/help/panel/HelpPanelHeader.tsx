
import React from "react";
import { DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { X } from "lucide-react";

interface HelpPanelHeaderProps {
  onClose: () => void;
}

export function HelpPanelHeader({ onClose }: HelpPanelHeaderProps) {
  return (
    <DrawerHeader className="border-b">
      <div className="flex items-center justify-between">
        <DrawerTitle className="text-xl font-bold">Βοηθός Πλατφόρμας</DrawerTitle>
        <DrawerClose onClick={onClose} className="rounded-full p-2 hover:bg-muted">
          <X className="h-4 w-4" />
        </DrawerClose>
      </div>
    </DrawerHeader>
  );
}
