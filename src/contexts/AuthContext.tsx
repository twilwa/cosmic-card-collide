
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { FactionType } from '@/types/gameTypes';

export interface PlayerData {
  id: string;
  username: string | null;
  faction: FactionType | null;
  avatar_url: string | null;
  resources: {
    credits: number;
    dataTokens: number;
  };
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  playerData: PlayerData | null;
  isLoading: boolean;
  error: Error | null;
  isGuest: boolean;
  signIn: (provider: 'github' | 'discord' | 'twitter' | 'google') => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  const fetchPlayerData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching player data:', error);
        return null;
      }

      // Convert supabase data to PlayerData type
      if (data) {
        return {
          id: data.id,
          username: data.username,
          faction: data.faction as FactionType | null,
          avatar_url: data.avatar_url,
          resources: {
            credits: typeof data.resources === 'object' && data.resources 
              ? (data.resources.credits || 5) 
              : 5,
            dataTokens: typeof data.resources === 'object' && data.resources 
              ? (data.resources.dataTokens || 3) 
              : 3,
          }
        } as PlayerData;
      }
      
      return null;
    } catch (err) {
      console.error('Error in fetchPlayerData:', err);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const playerData = await fetchPlayerData(session.user.id);
          setPlayerData(playerData);
          setIsGuest(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const playerData = await fetchPlayerData(session.user.id);
          setPlayerData(playerData);
          setIsGuest(false);
        } else {
          setPlayerData(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (provider: 'github' | 'discord' | 'twitter' | 'google') => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsGuest(false);
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const enableGuestMode = () => {
    setIsGuest(true);
    setPlayerData({
      id: 'guest-' + Math.random().toString(36).substring(2, 11),
      username: 'Guest',
      faction: null,
      avatar_url: null,
      resources: {
        credits: 5,
        dataTokens: 3,
      },
    });
  };

  const disableGuestMode = () => {
    setIsGuest(false);
    setPlayerData(null);
  };

  const contextValue: AuthContextType = {
    session,
    user,
    playerData,
    isLoading,
    error,
    isGuest,
    signIn,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    enableGuestMode,
    disableGuestMode,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
