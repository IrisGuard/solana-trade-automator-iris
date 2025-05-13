
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Template {
  id: string;
  name: string;
  default_config?: Record<string, any>;
  strategy?: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string;
  handleTemplateChange: (value: string) => void;
}

export function TemplateSelector({ 
  templates, 
  selectedTemplate, 
  handleTemplateChange 
}: TemplateSelectorProps) {
  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="template">Template (Optional)</Label>
      <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
        <SelectTrigger id="template">
          <SelectValue placeholder="Start from scratch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Start from scratch</SelectItem>
          {templates.map(template => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
