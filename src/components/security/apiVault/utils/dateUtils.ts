
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
