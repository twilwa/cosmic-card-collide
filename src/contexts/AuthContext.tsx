
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (provider: 'github' | 'discord' | 'twitter' | 'google') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN') {
          // Fetch player data from database after sign in
          if (session?.user) {
            fetchPlayerData(session.user.id);
          }
          
          toast({
            title: "Signed in successfully",
            description: `Welcome back, ${session?.user?.email || "User"}!`,
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Auth token refreshed');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch player data if user is signed in
      if (session?.user) {
        fetchPlayerData(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  // Fetch player data from our database
  const fetchPlayerData = async (userId: string) => {
    try {
      // Fetch player profile
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (playerError) {
        console.error('Error fetching player data:', playerError);
        return;
      }
      
      if (playerData) {
        console.log('Player data loaded:', playerData);
        // You could store this in a player context or state if needed
      }
      
      // Fetch player progress
      const { data: progressData, error: progressError } = await supabase
        .from('player_progress')
        .select('*')
        .eq('player_id', userId)
        .single();
        
      if (progressError) {
        console.error('Error fetching player progress:', progressError);
        return;
      }
      
      if (progressData) {
        console.log('Player progress loaded:', progressData);
        // You could store this in a player context or state if needed
      }
      
    } catch (error) {
      console.error('Error in fetchPlayerData:', error);
    }
  };

  const signIn = async (provider: 'github' | 'discord' | 'twitter' | 'google') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
