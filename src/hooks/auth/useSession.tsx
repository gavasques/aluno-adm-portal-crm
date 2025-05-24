
import React, { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthState } from "./useAuthState";
import { useInitialSession } from "./useInitialSession";
import { recoveryModeUtils } from "./useRecoveryMode";

export function useSession() {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();
  
  // Use the auth state hook for handling auth changes
  const authState = useAuthState();
  
  // Set our state from the auth state hook
  React.useEffect(() => {
    setUser(authState.user);
    setSession(authState.session);
    setLoading(authState.loading);
  }, [authState.user, authState.session, authState.loading]);
  
  // Check for an initial session
  useInitialSession(setSession, setUser, setLoading);

  return {
    user,
    session,
    loading,
    isInRecoveryMode: recoveryModeUtils.isInRecoveryMode,
    setRecoveryMode: recoveryModeUtils.setRecoveryMode
  };
}
