
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/auth";

// Constants for localStorage keys
export const RECOVERY_MODE_KEY = "supabase_recovery_mode";
export const RECOVERY_EXPIRY_KEY = "supabase_recovery_expiry";

export const usePasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setRecoveryMode } = useAuth();

  const validatePassword = () => {
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }
    
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Validate password
    if (!validatePassword()) {
      setLoading(false);
      return;
    }
    
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setSuccess(true);
      
      toast({
        title: "Senha atualizada com sucesso",
        description: "Você será redirecionado para a página de login",
        variant: "default",
      });
      
      // Clear recovery mode
      if (setRecoveryMode) {
        setRecoveryMode(false);
      } else {
        // Fallback if hook is not available
        localStorage.removeItem(RECOVERY_MODE_KEY);
        localStorage.removeItem(RECOVERY_EXPIRY_KEY);
      }
      
      // Sign out to force new authentication
      await supabase.auth.signOut();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setError(error.message || "Ocorreu um erro ao redefinir a senha. Tente novamente.");
      
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao atualizar sua senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    success,
    setSuccess,
    loading,
    setLoading,
    handleResetPassword
  };
};
