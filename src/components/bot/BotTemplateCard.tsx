
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";

interface BotTemplateCardProps {
  title: string;
  description: string;
  features: string[];
  templateId?: string;
  onCreateFromTemplate?: (templateId: string) => Promise<void>;
}

export function BotTemplateCard({ 
  title, 
  description, 
  features,
  templateId,
  onCreateFromTemplate
}: BotTemplateCardProps) {
  const { user } = useAuth();
  
  const handleCreateBot = async () => {
    if (!user) {
      toast.error("Συνδεθείτε πρώτα για να δημιουργήσετε bot");
      return;
    }
    
    if (templateId && onCreateFromTemplate) {
      await onCreateFromTemplate(templateId);
    } else {
      toast.info("Προτείνουμε να δημιουργήσετε ένα προσαρμοσμένο bot από την αρχή");
    }
  };

  return (
    <Card className="overflow-hidden border-dashed">
      <CardHeader className="bg-muted/50">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handleCreateBot}>
          Use Template
        </Button>
        <Button variant="ghost" size="sm">
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
