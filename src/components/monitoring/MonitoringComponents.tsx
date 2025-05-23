import { useEffect } from "react";
import { toast } from "sonner";
import { useConsoleErrorMonitor } from "@/hooks/useConsoleErrorMonitor";
import { useErrorDialogInChat } from "@/components/debug/ErrorDialogInChat";
import { displayError } from "@/utils/error-handling/displayError";

// Component that monitors for console errors
export function ErrorMonitor() {
  useConsoleErrorMonitor();
  return null;
}

// Component for displaying error dialogs
export function ErrorDialogsRenderer() {
  const { ErrorDialogs } = useErrorDialogInChat();
  return <ErrorDialogs />;
}

// Component that checks for publish errors
export function PublishErrorMonitor() {
  useEffect(() => {
    // Check for publish errors
    const handlePublishErrors = () => {
      try {
        // Check if we're in production environment
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          console.log("Running publish error checks...");
          
          // Check Supabase connection
          fetch('https://lvkbyfocssuzcdphpmfu.supabase.co/rest/v1/', {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc'
            }
          })
            .then(response => {
              if (!response.ok) throw new Error("Cannot connect to Supabase");
              console.log("Successful Supabase connection");
            })
            .catch(error => {
              displayError(error, {
                title: "Publish Error",
                showToast: true,
                component: 'PublishErrorMonitor',
                sendToChat: true,
                useCollector: true,
                details: {
                  origin: 'supabase-check'
                }
              });
            });
            
          // Other checks can be added here...
        }
      } catch (e) {
        console.error("Error during publish error checks:", e);
      }
    };
    
    // Execute check after a brief delay to allow the app to fully load
    const timer = setTimeout(handlePublishErrors, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return null;
}

// Comprehensive monitoring system component
export function MonitoringSystem() {
  return (
    <>
      <ErrorMonitor />
      <ErrorDialogsRenderer />
      <PublishErrorMonitor />
    </>
  );
}
