
import { useSignInOut } from "./useSignInOut";
import { useSignUp } from "./useSignUp";
import { usePasswordReset } from "./usePasswordReset";
import { useMagicLink } from "./useMagicLink";
import { useAdminOperations } from "./useAdminOperations";

export function useBasicAuth() {
  const { signIn, signOut } = useSignInOut();
  const { signUp } = useSignUp();
  const { resetPassword, updateUserPassword } = usePasswordReset();
  const { sendMagicLink } = useMagicLink();
  const { createAdminUser } = useAdminOperations();

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserPassword,
    sendMagicLink,
    createAdminUser
  };
}

export * from "./useSignInOut";
export * from "./useSignUp";
export * from "./usePasswordReset";
export * from "./useMagicLink";
export * from "./useAdminOperations";
