
import React from "react";
import { CommandItem } from "./CommandItem";

interface CommandCategoryProps {
  commands: {
    command: string;
    descriptionKey: string;
    details: string;
  }[];
  t: (key: string) => string;
}

export function CommandCategory({ commands, t }: CommandCategoryProps) {
  return (
    <div className="space-y-2">
      {commands.map((cmd, index) => (
        <CommandItem key={index} command={cmd} t={t} />
      ))}
    </div>
  );
}
