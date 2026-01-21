import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useDescope, useSession, useUser } from '@descope/react-sdk';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface DescopeAuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isSessionLoading: boolean;
  descopeUser: any;
  descopeSession: any;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const DescopeAuthContext = createContext<DescopeAuthContextType | undefined>(undefined);

export const DescopeAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  
  // Descope hooks
  const descope = useDescope();
  const { isAuthenticated: isDescopeAuthenticated, isSessionLoading: isDescopeLoading } = descope;
  const { session: descopeSession, isSessionLoading: descopeSessionLoading } = useSession();
  const { user: descopeUser, isUserLoading } = useUser();

  // Sync Descope session with Supabase
  const syncWithSupabase = async (descopeSessionToken?: string) => {
    if (!descopeSessionToken || !descopeUser) {
      // Clear local state if no Descope session
      setUser(null);
      setSession(null);
      return;
    }

    try {
      // Create a mock Supabase user object for consistency with existing components
      const mockUser: User = {
        id: descopeUser.userId || descopeUser.loginId,
        email: descopeUser.email,
        user_metadata: {
          full_name: descopeUser.name || '',
          descope_user_id: descopeUser.userId,
          provider: 'descope'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        phone_confirmed_at: null,
        confirmation_sent_at: null,
        recovery_sent_at: null,
        email_change_sent_at: null,
        new_email: null,
        invited_at: null,
        action_link: null,
        phone: null,
        factors: null,
        identities: []
      };

      // Create a mock session object
      const mockSession: Session = {
        access_token: descopeSessionToken,
        refresh_token: descopeSessionToken,
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      };

      setUser(mockUser);
      setSession(mockSession);

      // Optionally sync with your backend here
      // await syncUserWithBackend(descopeUser);

    } catch (error) {
      console.error('Error syncing with Supabase:', error);
    }
  };

  // Monitor Descope session changes
  useEffect(() => {
    if (!isDescopeLoading && !descopeSessionLoading && !isUserLoading) {
      if (isDescopeAuthenticated && descopeSession && descopeUser) {
        syncWithSupabase(descopeSession.sessionToken);
      } else {
        syncWithSupabase();
      }
      setIsSessionLoading(false);
    }
  }, [isDescopeAuthenticated, descopeSession, descopeUser, isDescopeLoading, descopeSessionLoading, isUserLoading]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    // For Descope, we'll redirect to the flow instead of handling signup directly
    return { error: new Error('Please use the Descope flow for signup') };
  };

  const signIn = async (email: string, password: string) => {
    // For Descope, we'll redirect to the flow instead of handling signin directly
    return { error: new Error('Please use the Descope flow for signin') };
  };

  const logout = async () => {
    try {
      // Logout from Descope
      await descope.logout();
      
      // Clear local state
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshSession = async () => {
    if (descopeSession) {
      await syncWithSupabase(descopeSession.sessionToken);
    }
  };

  return (
    <DescopeAuthContext.Provider 
      value={{ 
        user, 
        session, 
        isAuthenticated: isDescopeAuthenticated, 
        isSessionLoading, 
        descopeUser,
        descopeSession,
        signUp, 
        signIn, 
        logout,
        refreshSession
      }}
    >
      {children}
    </DescopeAuthContext.Provider>
  );
};

export const useDescopeAuth = () => {
  const context = useContext(DescopeAuthContext);
  if (context === undefined) {
    throw new Error('useDescopeAuth must be used within a DescopeAuthProvider');
  }
  return context;
};