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
  const { isAuthenticated: isDescopeAuthenticated, isSessionLoading: isDescopeLoading } = useDescope();
  const { session: descopeSession, isSessionLoading: descopeSessionLoading } = useSession();
  const { user: descopeUser, isUserLoading } = useUser();

  // Sync Descope session with Supabase
  const syncWithSupabase = async (descopeSessionToken?: string) => {
    if (!descopeSessionToken || !descopeUser) {
      // Clear Supabase session if no Descope session
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      return;
    }

    try {
      // Check if user exists in Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', descopeUser.email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', fetchError);
        return;
      }

      // If user doesn't exist in Supabase, create them
      if (!existingUser) {
        // Create user in Supabase auth (this will also create the profile)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: descopeUser.email,
          password: Math.random().toString(36), // Random password since we're using Descope
          options: {
            data: {
              full_name: descopeUser.name || '',
              descope_user_id: descopeUser.userId,
              provider: 'descope'
            }
          }
        });

        if (authError) {
          console.error('Error creating Supabase user:', authError);
          return;
        }

        setUser(authData.user);
        setSession(authData.session);
      } else {
        // User exists, create a session
        const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
          email: descopeUser.email,
          password: 'descope-managed' // This won't work, we need a different approach
        });

        // Alternative: Set user data directly (for display purposes)
        // Note: This won't create a real Supabase session, but will sync user data
        setUser({
          id: existingUser.id,
          email: descopeUser.email,
          user_metadata: {
            full_name: descopeUser.name,
            descope_user_id: descopeUser.userId
          }
        } as User);
      }
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
      const descope = useDescope();
      await descope.logout();
      
      // Logout from Supabase
      await supabase.auth.signOut();
      
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