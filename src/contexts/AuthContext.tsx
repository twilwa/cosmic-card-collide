
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { PlayerData } from '@/types/gameTypes';
import { toast } from 'sonner';

// Define context type
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  playerData: PlayerData | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setGuestMode: (isGuest: boolean) => void;
  isGuest: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  playerData: null,
  isLoading: true,
  signUp: async () => {},
  signOut: async () => {},
  setGuestMode: () => {},
  isGuest: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check active session and set user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchPlayerData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchPlayerData(session.user.id);
        } else {
          setPlayerData(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPlayerData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Convert db result to PlayerData type
        const resourcesData = data.resources as {
          credits: number;
          dataTokens: number;
        };

        setPlayerData({
          id: data.id,
          username: data.username,
          faction: data.faction,
          avatar_url: data.avatar_url || '',
          resources: resourcesData,
        });
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Check your email for confirmation link",
      });
    } catch (error) {
      toast({
        title: "Error during signup",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setPlayerData(null);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const setGuestMode = (guest: boolean) => {
    setIsGuest(guest);
    if (guest) {
      // Set default guest data
      setPlayerData({
        id: 'guest',
        username: 'Guest',
        faction: null,
        avatar_url: '',
        resources: {
          credits: 5,
          dataTokens: 3
        }
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      playerData, 
      isLoading, 
      signUp, 
      signOut, 
      setGuestMode, 
      isGuest 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
