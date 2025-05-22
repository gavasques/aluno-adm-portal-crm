
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { recoveryModeUtils } from "./useRecoveryMode";

export const useTokenValidation = () => {
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const { session, setRecoveryMode } = useAuth();
  const [searchParams] = useSearchParams();

  // Extract all possible parameters of token
  const typeParam = searchParams.get('type');
  const tokenParam = searchParams.get('token') || searchParams.get('access_token');
  const hashParams = window.location.hash;

  // Function to try to extract a token from the hash URL
  const extractTokenFromHash = () => {
    if (!hashParams) return null;
    
    // Various possible hash formats
    const accessTokenMatch = hashParams.match(/access_token=([^&]+)/);
    
    console.log("Hash params:", hashParams);
    console.log("Access token match:", accessTokenMatch);
    
    return accessTokenMatch ? accessTokenMatch[1] : null;
  };
  
  const extractedTokenFromHash = extractTokenFromHash();
  
  // Check if we are in a password recovery flow
  const isRecoveryFlow = 
    typeParam === 'recovery' || 
    searchParams.get('reset_token') === 'true' ||
    !!tokenParam || 
    !!extractedTokenFromHash ||
    hashParams.includes('type=recovery');

  useEffect(() => {
    // Validate if the token is valid
    const validateToken = async () => {
      setValidatingToken(true);
      console.log("Validando token de recuperação...");
      
      try {
        // Check token and session information
        console.log("Parâmetros da URL:", {
          typeParam,
          tokenParam,
          hashParams,
          extractedTokenFromHash,
          isRecoveryFlow
        });
        
        // If we have no indication of recovery flow and no session, invalidate
        if (!isRecoveryFlow && !session) {
          console.log("Nenhum token de recuperação detectado e sem sessão ativa");
          setError("Link inválido ou expirado. Solicite um novo link de recuperação de senha.");
          setTokenValid(false);
          setValidatingToken(false);
          return;
        }

        // Check if the user has a valid recovery session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Sessão atual:", currentSession);
        
        if ((currentSession?.user?.aud === "recovery") || 
            isRecoveryFlow || 
            (currentSession && window.location.pathname === "/reset-password")) {
          console.log("Sessão de recuperação válida detectada ou fluxo de recuperação identificado");
          
          // Set recovery mode for all tabs
          if (setRecoveryMode) {
            setRecoveryMode(true);
          } else {
            // Fallback if hook is not available
            recoveryModeUtils.setRecoveryMode(true);
          }
          
          setTokenValid(true);
        } else {
          console.log("Sessão não é de recuperação:", currentSession?.user?.aud);
          setError("Link inválido ou expirado. Solicite um novo link de recuperação de senha.");
          setTokenValid(false);
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setError("Link inválido ou expirado. Solicite um novo link de recuperação de senha.");
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };
    
    validateToken();
  }, [tokenParam, typeParam, isRecoveryFlow, setRecoveryMode, session, extractedTokenFromHash, hashParams]);

  return {
    validatingToken,
    tokenValid,
    error,
    isRecoveryFlow
  };
};
