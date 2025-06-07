
import React, { createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useRobustAuth } from "./useRobustAuth";
import { useBasicAuth } from "./useBasicAuth";
import { useSocialAuth } from "./useSocialAuth";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  retryCount: number;
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
  console.log('🏠 AuthProvider: Renderizando...');
  
  const robustAuth = useRobustAuth();
  const { signIn, signUp, signOut, resetPassword, updateUserPassword } = useBasicAuth();
  const { linkIdentity, unlinkIdentity, getLinkedIdentities } = useSocialAuth(robustAuth.user);

  const setRecoveryMode = (enabled: boolean) => {
    console.log('🔄 AuthProvider: setRecoveryMode:', enabled);
    if (enabled) {
      localStorage.setItem("recovery_mode", "true");
    } else {
      localStorage.removeItem("recovery_mode");
    }
  };

  const contextValue = {
    user: robustAuth.user,
    session: robustAuth.session,
    loading: robustAuth.loading,
    error: robustAuth.error,
    isInitialized: robustAuth.isInitialized,
    retryCount: robustAuth.retryCount,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserPassword,
    linkIdentity,
    unlinkIdentity,
    getLinkedIdentities,
    setRecoveryMode
  };

  console.log('🏠 AuthProvider: Estado do contexto:', { 
    hasUser: !!robustAuth.user, 
    loading: robustAuth.loading, 
    error: robustAuth.error,
    isInitialized: robustAuth.isInitialized,
    retryCount: robustAuth.retryCount,
    userEmail: robustAuth.user?.email 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.error('❌ useAuth: Deve ser usado dentro de um AuthProvider');
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};
