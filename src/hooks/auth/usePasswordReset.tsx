
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/auth";
import { recoveryModeUtils } from "./useRecoveryMode";
import { validatePassword, sanitizeError, logSecureError } from "@/utils/security";

export const usePasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setRecoveryMode } = useAuth();

  const validateForm = () => {
    const passwordValidation = validatePassword(password);
    
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(". "));
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
    if (!validateForm()) {
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
        recoveryModeUtils.setRecoveryMode(false);
      }
      
      // Sign out to force new authentication
      await supabase.auth.signOut();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      logSecureError(error, "Password Reset");
      const sanitizedMessage = sanitizeError(error);
      setError(sanitizedMessage);
      
      toast({
        title: "Erro ao atualizar senha",
        description: sanitizedMessage,
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
