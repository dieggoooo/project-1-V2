'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  position: string;
  role: string;
  airline_id: string;
  airline_name: string;
  airline_code: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (data: SignUpData) => Promise<{ error: Error | null; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  position: string;
  airlineId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, employee_id, position, role, airline_id, airlines(name, code)')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  const airlineRaw = data.airlines as unknown;
  const airline = (Array.isArray(airlineRaw) ? airlineRaw[0] : airlineRaw) as { name: string; code: string } | null;
  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    employee_id: data.employee_id,
    position: data.position,
    role: data.role,
    airline_id: data.airline_id,
    airline_name: airline?.name ?? '',
    airline_code: airline?.code ?? '',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error('Error getting session:', error);

        if (session) {
          setSession(session);
          setUser(session.user);
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        const p = await fetchProfile(data.user.id);
        setProfile(p);
        router.push('/');
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signUp = async ({ email, password, firstName, lastName, employeeId, position, airlineId }: SignUpData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: undefined },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile row
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          airline_id: airlineId,
          first_name: firstName,
          last_name: lastName,
          employee_id: employeeId,
          position,
          role: 'flight_attendant',
        });

        if (profileError) throw profileError;
      }

      // Email confirmation required
      if (data.user && !data.session) {
        return { error: null, needsConfirmation: true };
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        const p = await fetchProfile(data.user!.id);
        setProfile(p);
        router.push('/');
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      setProfile(null);
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut }}>
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
