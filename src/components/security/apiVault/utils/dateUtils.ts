
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";

export const formatRelativeDate = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: el
    });
  } catch (e) {
    return "Άγνωστη ημερομηνία";
  }
};

// Έλεγχος αν η ημερομηνία είναι παλιότερη από X ημέρες
export const isDateOlderThan = (dateString: string, days: number): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays > days;
  } catch (e) {
    return false;
  }
};

// Μορφοποίηση ημερομηνίας σε τοπικό format
export const formatLocalDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('el-GR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return "Άγνωστη ημερομηνία";
  }
};
