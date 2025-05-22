
import { useLanguage } from "./use-language";

export const useTranslation = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return { t, language, setLanguage };
};
