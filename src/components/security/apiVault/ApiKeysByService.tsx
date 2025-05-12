
import React from "react";
import { ApiKey } from "./types";
import { ApiKeyList } from "./ApiKeyList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ApiKeysByServiceProps {
  keysByService: Record<string, ApiKey[]>;
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  deleteKey: (id: string) => void;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

export const ApiKeysByService: React.FC<ApiKeysByServiceProps> = ({
  keysByService,
  isKeyVisible,
  toggleKeyVisibility,
  deleteKey,
  setApiKeys
}) => {
  const services = Object.keys(keysByService).sort();

  return (
    <div>
      {services.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground">
          Δεν βρέθηκαν υπηρεσίες με τα τρέχοντα κριτήρια αναζήτησης
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={[services[0]]}>
          {services.map((service) => (
            <AccordionItem key={service} value={service}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium text-left">{service}</span>
                  <Badge variant="outline" className="ml-2">
                    {keysByService[service].length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <ApiKeyList 
                  apiKeys={keysByService[service]} 
                  isKeyVisible={isKeyVisible}
                  toggleKeyVisibility={toggleKeyVisibility}
                  deleteKey={deleteKey}
                  setApiKeys={setApiKeys}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
