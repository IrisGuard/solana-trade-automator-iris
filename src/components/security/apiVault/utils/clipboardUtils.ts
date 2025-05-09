
import { toast } from "sonner";

// Handle copying key to clipboard
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success("Το κλειδί αντιγράφηκε στο πρόχειρο");
    })
    .catch(() => {
      toast.error("Αποτυχία αντιγραφής στο πρόχειρο");
    });
};
