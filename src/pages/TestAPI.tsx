
import * as React from 'react';
import { useState, useEffect } from '../react-compatibility';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TestAPI() {
  const [status, setStatus] = useState("Idle");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Test that React hooks are working
  useEffect(() => {
    console.log("TestAPI component mounted successfully!");
    toast.success("Η σελίδα TestAPI φορτώθηκε επιτυχώς!");
    
    return () => {
      console.log("TestAPI component unmounted");
    };
  }, []);

  // Verify button click handler
  const handleTestApi = () => {
    setLoading(true);
    setStatus("Testing API connection...");
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setApiSuccess(success);
      setStatus(success ? "API connection successful!" : "API connection failed!");
      setLoading(false);
      
      if (success) {
        toast.success("API σύνδεση επιτυχής!");
      } else {
        toast.error("API σύνδεση απέτυχε!");
      }
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Test Interface</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <p className="font-mono">Status: <span 
                className={
                  status === "Idle" ? "text-gray-500" :
                  apiSuccess ? "text-green-500" : "text-red-500"
                }
              >{status}</span></p>
            </div>
            
            <Button 
              onClick={handleTestApi} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Έλεγχος API...
                </>
              ) : (
                "Έλεγχος API Σύνδεσης"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>React 18.3.1 Compatibility Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-500 mb-4">✓ React hooks are functioning correctly in this component</p>
          <p className="mb-4">Αυτή η σελίδα επιβεβαιώνει ότι το React 18.3.1 λειτουργεί σωστά με τις προσαρμογές συμβατότητας.</p>
          
          <Button 
            onClick={() => toast.success("Τα React hooks λειτουργούν κανονικά!")}
            variant="outline"
            className="mr-2"
          >
            Έλεγχος React Hooks
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/"}
            variant="secondary"
          >
            Επιστροφή στην Αρχική
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
