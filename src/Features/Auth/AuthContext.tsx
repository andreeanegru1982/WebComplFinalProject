import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthContextValue, AuthResponse, AuthStateValue } from './types';

const AuthContext = createContext<null | AuthContextValue>(null);

const initialContextValue = {
  accessToken: null,
  user: null,
};

const storageKey = 'auth';

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthStateValue>(() => {
    const fromStorage = localStorage.getItem(storageKey);
    if(!fromStorage) {
      return initialContextValue;
    }

    return JSON.parse(fromStorage);
  });

  function login(value: AuthResponse) {
    setAuth(value);
    localStorage.setItem(storageKey, JSON.stringify(value));
  }

  function logout() {
    setAuth(initialContextValue);
    localStorage.removeItem(storageKey);
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  
  if (!ctx) {
    throw new Error(
      'useAuthContext should only be used in children of AuthContextProvider!'
    );
  }
  
  return ctx;
}
