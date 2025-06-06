
import React, { createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useSimpleAuth } from "./useSimpleAuth";
import { useBasicAuth } from "./useBasicAuth";

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
  // Funções adicionais que outros componentes esperam
  signInWithGoogle?: () => Promise<void>;
  sendMagicLink?: (email: string) => Promise<boolean>;
  linkIdentity?: (provider: string) => Promise<void>;
  unlinkIdentity?: (provider: string, id: string) => Promise<void>;
  getLinkedIdentities?: () => any[] | null;
  setRecoveryMode?: (mode: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, session, loading, error } = useSimpleAuth();
  const { signIn, signUp, signOut, resetPassword, updateUserPassword } = useBasicAuth();

  console.log('🏠 AuthProvider state:', { 
    hasUser: !!user, 
    loading, 
    error,
    userEmail: user?.email 
  });

  // Implementações básicas para evitar erros - podem ser expandidas depois
  const signInWithGoogle = async () => {
    console.log('🔄 Google sign-in não implementado ainda');
  };

  const sendMagicLink = async (email: string): Promise<boolean> => {
    console.log('🔄 Magic link não implementado ainda');
    return false;
  };

  const linkIdentity = async (provider: string) => {
    console.log('🔄 Link identity não implementado ainda');
  };

  const unlinkIdentity = async (provider: string, id: string) => {
    console.log('🔄 Unlink identity não implementado ainda');
  };

  const getLinkedIdentities = () => {
    console.log('🔄 Get linked identities não implementado ainda');
    return [];
  };

  const setRecoveryMode = (mode: boolean) => {
    console.log('🔄 Recovery mode não implementado ainda');
  };

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
        signInWithGoogle,
        sendMagicLink,
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
