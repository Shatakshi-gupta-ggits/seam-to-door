import { createContext, useContext, ReactNode } from 'react';
import { AuthProvider as DescopeAuthProvider, useDescope, useSession, useUser } from '@descope/react-sdk';

interface DescopeContextType {
  isAuthenticated: boolean;
  isSessionLoading: boolean;
  user: any;
  logout: () => Promise<void>;
}

const DescopeContext = createContext<DescopeContextType | undefined>(undefined);

const DESCOPE_PROJECT_ID = "P37vaF398AxQbhS7fFW2mrNIKO0i";

const DescopeContextProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user } = useUser();
  const sdk = useDescope();

  const logout = async () => {
    await sdk.logout();
  };

  return (
    <DescopeContext.Provider value={{ isAuthenticated, isSessionLoading, user, logout }}>
      {children}
    </DescopeContext.Provider>
  );
};

export const DescopeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <DescopeAuthProvider projectId={DESCOPE_PROJECT_ID}>
      <DescopeContextProvider>
        {children}
      </DescopeContextProvider>
    </DescopeAuthProvider>
  );
};

export const useDescopeAuth = () => {
  const context = useContext(DescopeContext);
  if (context === undefined) {
    throw new Error('useDescopeAuth must be used within a DescopeProvider');
  }
  return context;
};
