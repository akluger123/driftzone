import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import type { User } from "@supabase/supabase-js";

export interface GameProfile {
  total_coins: number;
  owned_decals: string[];
  equipped_decal: string | null;
  selected_car: string;
  high_score: number;
  display_name: string | null;
  avatar_url: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("total_coins, owned_decals, equipped_decal, selected_car, high_score, display_name, avatar_url")
      .eq("user_id", userId)
      .single();

    if (data) {
      setProfile(data as GameProfile);
    }
  };

  const saveProgress = useCallback(async (progress: Partial<GameProfile>) => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update(progress)
      .eq("user_id", user.id);
    
    setProfile(prev => prev ? { ...prev, ...progress } : null);
  }, [user]);

  const signInWithGoogle = async () => {
    await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return { user, profile, loading, signInWithGoogle, signOut, saveProgress, fetchProfile: () => user && fetchProfile(user.id) };
}
