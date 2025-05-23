
export interface User {
  id: string;
  username?: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export function useUser(): AuthContextType {
  return {
    user: null,
    loading: false
  };
}
