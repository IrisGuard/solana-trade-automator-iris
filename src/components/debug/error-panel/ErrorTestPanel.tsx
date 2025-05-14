
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { errorCollector } from "@/utils/error-handling/collector";
import { displayError } from "@/utils/error-handling/displayError";

const testErrorTypes = [
  {
    name: "Σφάλμα συγχρονισμού",
    generate: () => {
      throw new Error("Δοκιμαστικό σφάλμα συγχρονισμού");
    }
  },
  {
    name: "Ασύγχρονο σφάλμα",
    generate: async () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Δοκιμαστικό ασύγχρονο σφάλμα"));
        }, 300);
      });
    }
  },
  {
    name: "Σφάλμα δικτύου",
    generate: () => {
      const error = new Error("Σφάλμα δικτύου: Αδυναμία σύνδεσης με τον διακομιστή");
      error.name = "NetworkError";
      throw error;
    }
  },
  {
    name: "Σφάλμα ελλιπών δεδομένων",
    generate: () => {
      throw new Error("Ελλιπή δεδομένα: Λείπουν απαιτούμενα πεδία");
    }
  }
];

export function ErrorTestPanel() {
  const triggerSyncError = (index: number) => {
    try {
      testErrorTypes[index].generate();
    } catch (error) {
      if (error instanceof Error) {
        displayError(error, { 
          title: "Δοκιμαστικό σφάλμα", 
          showToast: true,
          useCollector: true,
          component: "ErrorTestPanel"
        });
      }
    }
  };

  const triggerAsyncError = async (index: number) => {
    try {
      await testErrorTypes[index].generate();
    } catch (error) {
      if (error instanceof Error) {
        displayError(error, { 
          title: "Δοκιμαστικό ασύγχρονο σφάλμα", 
          showToast: true,
          useCollector: true,
          component: "ErrorTestPanel"
        });
      }
    }
  };

  const reportCollectedErrors = async () => {
    // Call the reportErrors method that we've added to ErrorCollector
    await errorCollector.reportErrors();
  };

  const clearCollectedErrors = () => {
    errorCollector.clearErrors();
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Δοκιμή διαχείρισης σφαλμάτων</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {testErrorTypes.map((errorType, index) => (
            <Button 
              key={index} 
              variant="outline" 
              onClick={() => errorType.name.includes("Ασύγχρονο") 
                ? triggerAsyncError(index) 
                : triggerSyncError(index)
              }
            >
              {errorType.name}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex justify-between w-full">
          <Button 
            variant="default" 
            onClick={reportCollectedErrors}
          >
            Αναφορά σφαλμάτων
          </Button>
          <Button 
            variant="destructive" 
            onClick={clearCollectedErrors}
          >
            Καθαρισμός σφαλμάτων
          </Button>
        </div>
        <p className="text-xs text-muted-foreground self-start mt-2">
          Τα σφάλματα αποθηκεύονται τοπικά πριν από την αναφορά
        </p>
      </CardFooter>
    </Card>
  );
}
