
import React from "react";
import { ResourceLink, ResourceCategory } from "./types";
import { ResourceCard } from "./ResourceCard";

interface ResourceResultsProps {
  filteredResources: ResourceLink[];
  categories: ResourceCategory[];
  searchQuery: string;
}

export function ResourceResults({ filteredResources, categories, searchQuery }: ResourceResultsProps) {
  if (filteredResources.length === 0) {
    return (
      <div className="text-center py-8">
        {searchQuery ? (
          <p className="text-muted-foreground">Δεν βρέθηκαν αποτελέσματα για τα κριτήρια αναζήτησης.</p>
        ) : (
          <p className="text-muted-foreground">Επιλέξτε μια κατηγορία ή κάντε αναζήτηση για να δείτε πόρους.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredResources.map((resource, index) => (
        <ResourceCard key={index} resource={resource} categories={categories} />
      ))}
    </div>
  );
}
