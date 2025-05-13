
import { useState, useEffect } from "react";
import { ApiEndpoint, fetchApiEndpoints, addApiEndpoint, updateApiEndpoint, deleteApiEndpoint } from "@/utils/supabaseEndpoints";
import { toast } from "sonner";

export function useEndpoints() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = async () => {
    setLoading(true);
    try {
      const data = await fetchApiEndpoints();
      setEndpoints(data);
    } catch (error) {
      console.error("Error loading endpoints:", error);
      toast.error("Σφάλμα κατά τη φόρτωση των endpoints");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEndpoint = async (endpoint: ApiEndpoint) => {
    setLoading(true);
    try {
      await addApiEndpoint(endpoint);
      await loadEndpoints();
      return true;
    } catch (error) {
      console.error("Error adding endpoint:", error);
      toast.error("Σφάλμα κατά την προσθήκη του endpoint");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEndpoint = async (id: string, endpoint: ApiEndpoint) => {
    setLoading(true);
    try {
      await updateApiEndpoint(id, endpoint);
      await loadEndpoints();
      return true;
    } catch (error) {
      console.error("Error updating endpoint:", error);
      toast.error("Σφάλμα κατά την ενημέρωση του endpoint");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEndpoint = async (id: string) => {
    setLoading(true);
    try {
      await deleteApiEndpoint(id);
      await loadEndpoints();
      return true;
    } catch (error) {
      console.error("Error deleting endpoint:", error);
      toast.error("Σφάλμα κατά τη διαγραφή του endpoint");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    endpoints,
    loading,
    loadEndpoints,
    handleAddEndpoint,
    handleUpdateEndpoint,
    handleDeleteEndpoint,
  };
}
