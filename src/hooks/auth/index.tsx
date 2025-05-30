
import React, { createContext, useContext, ReactNode } from "react";
import { User, Session, Provider } from "@supabase/supabase-js";
import { useSession } from "./useSession";
import { useBasicAuth } from "./useBasicAuth";
import { useSocialAuth } from "./useSocialAuth";
import { recoveryModeUtils } from "./useRecoveryMode";

// Import the CreateUserResult interface
import { CreateUserResult } from "./useBasicAuth/useAdminOperations";

// URL base do site que será usado para redirecionamentos
const BASE_URL = "https://titan.guilhermevasques.club";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<boolean>;
  linkIdentity: (provider: Provider) => Promise<void>;
  unlinkIdentity: (provider: Provider, identity_id: string) => Promise<void>;
  getLinkedIdentities: () => Array<{id: string, provider: string}> | null;
  isInRecoveryMode?: () => boolean;
  setRecoveryMode?: (enabled: boolean) => void;
  createAdminUser: (email: string, name: string, role: string, password: string) => Promise<CreateUserResult>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, session, loading, isInRecoveryMode, setRecoveryMode } = useSession();
  const { signIn, signUp, signOut, resetPassword, updateUserPassword, sendMagicLink, createAdminUser } = useBasicAuth();
  const { signInWithGoogle, linkIdentity, unlinkIdentity, getLinkedIdentities } = useSocialAuth(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
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
        isInRecoveryMode,
        setRecoveryMode,
        createAdminUser
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

// Export recovery mode utilities directly
export { recoveryModeUtils };

// Re-export the CreateUserResult for other components to use
export type { CreateUserResult };
