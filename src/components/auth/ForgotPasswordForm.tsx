
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useEnhancedRateLimitedAuth } from "@/hooks/auth/useEnhancedRateLimitedAuth";
import { EnhancedSecurityIndicator } from "./EnhancedSecurityIndicator";

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
  onSuccess?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  onBackToLogin, 
  onSuccess 
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { resetPassword, isRateLimited, remainingTime, riskLevel, getRemainingAttempts } = useEnhancedRateLimitedAuth();
  const remainingAttempts = getRemainingAttempts('password_reset');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRateLimited) {
      return;
    }
    
    setError("");
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || "Erro ao solicitar recuperação de senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-green-600">
          <Mail className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">Email enviado!</h3>
          <p className="text-sm text-gray-600 mt-2">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
        </div>
        
        {onBackToLogin && (
          <Button
            type="button"
            variant="outline"
            onClick={onBackToLogin}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Recuperar senha</h3>
        <p className="text-sm text-gray-600 mt-2">
          Digite seu email para receber instruções de recuperação
        </p>
      </div>

      <EnhancedSecurityIndicator
        isRateLimited={isRateLimited}
        remainingTime={remainingTime}
        remainingAttempts={remainingAttempts}
        riskLevel={riskLevel}
        className="mb-4"
      />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isRateLimited}
              autoComplete="email"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isRateLimited || !email.trim()}
        >
          {isLoading ? "Enviando..." : "Enviar instruções"}
        </Button>

        {onBackToLogin && (
          <Button
            type="button"
            variant="outline"
            onClick={onBackToLogin}
            className="w-full"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        )}
      </form>
    </div>
  );
};
