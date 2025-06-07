
import React, { createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useSimpleAuth } from "./useSimpleAuth";
import { useBasicAuth } from "./useBasicAuth";
import { useSocialAuth } from "./useSocialAuth";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  linkIdentity: (provider: 'google') => Promise<void>;
  unlinkIdentity: (provider: string, identity_id: string) => Promise<void>;
  getLinkedIdentities: () => Array<{ id: string; provider: string; }> | null;
  setRecoveryMode: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, session, loading, error } = useSimpleAuth();
  const { signIn, signUp, signOut, resetPassword, updateUserPassword } = useBasicAuth();
  const { linkIdentity, unlinkIdentity, getLinkedIdentities } = useSocialAuth(user);

  const setRecoveryMode = (enabled: boolean) => {
    // Implementação simples do recovery mode
    if (enabled) {
      localStorage.setItem("recovery_mode", "true");
    } else {
      localStorage.removeItem("recovery_mode");
    }
  };

  console.log('🏠 AuthProvider state:', { 
    hasUser: !!user, 
    loading, 
    error,
    userEmail: user?.email 
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateUserPassword,
        linkIdentity,
        unlinkIdentity,
        getLinkedIdentities,
        setRecoveryMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};
