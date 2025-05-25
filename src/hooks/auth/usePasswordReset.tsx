
import { useState } from "react";
import { usePasswordReset as usePasswordResetHook } from "./useBasicAuth/usePasswordReset";

export const usePasswordReset = () => {
  const { updateUserPassword } = usePasswordResetHook();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateUserPassword(password);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "Erro ao redefinir senha");
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
    success,
    loading,
    handleResetPassword,
    updateUserPassword
  };
};
