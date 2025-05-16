
import React from "react";

interface CommandItemProps {
  command: {
    command: string;
    descriptionKey: string;
    details: string;
  };
  t: (key: string) => string;
}

export function CommandItem({ command, t }: CommandItemProps) {
  return (
    <div className="border rounded-md p-3 hover:bg-accent">
      <div className="flex justify-between items-center">
        <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
          {command.command}
        </code>
        <span className="text-xs text-muted-foreground">{t("general.command")}</span>
      </div>
      <p className="text-sm mt-1">
        {command.descriptionKey.includes('.') ? t(command.descriptionKey) : command.descriptionKey}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {command.details}
      </p>
    </div>
  );
}
