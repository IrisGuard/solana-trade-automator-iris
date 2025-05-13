
/**
 * This hook centralizes all router-related functionality
 * and ensures compatibility across the application
 */

import {
  useNavigate as useRouterNavigate,
  useLocation as useRouterLocation,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams
} from '@/lib/router-exports';

export function useNavigate() {
  return useRouterNavigate();
}

export function useLocation() {
  return useRouterLocation();
}

export function useParams() {
  return useRouterParams();
}

export function useSearchParams() {
  return useRouterSearchParams();
}

// Helper function to navigate programmatically
export function useRouterNavigation() {
  const navigate = useNavigate();
  
  const goTo = (path: string) => {
    navigate(path);
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  return {
    goTo,
    goBack,
    navigate
  };
}
