
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
    
    console.log("=== TOKEN VALIDATION DEBUG ===");
    console.log("Hash params:", hashParams);
    console.log("Access token match:", accessTokenMatch);
    console.log("Type param:", typeParam);
    console.log("Token param:", tokenParam);
    console.log("Current URL:", window.location.href);
    console.log("===============================");
    
    return accessTokenMatch ? accessTokenMatch[1] : null;
  };
  
  const extractedTokenFromHash = extractTokenFromHash();
  
  // Check if we are in a password recovery flow
  const isRecoveryFlow = 
    typeParam === 'recovery' || 
    (!!tokenParam && typeParam === 'recovery') || 
    (!!extractedTokenFromHash && hashParams.includes('type=recovery')) ||
    (!!extractedTokenFromHash && window.location.pathname === "/reset-password");

  useEffect(() => {
    // Validate if the token is valid
    const validateToken = async () => {
      setValidatingToken(true);
      console.log("=== VALIDANDO TOKEN DE RECUPERAÇÃO ===");
      
      try {
        // Check token and session information
        console.log("Parâmetros detectados:", {
          typeParam,
          tokenParam,
          hashParams,
          extractedTokenFromHash,
          isRecoveryFlow,
          pathname: window.location.pathname
        });
        
        // Se não é um fluxo de recovery, invalidar
        if (!isRecoveryFlow) {
          console.log("❌ Não é um fluxo de recovery detectado");
          setError("Link inválido ou expirado. Solicite um novo link de recuperação de senha.");
          setTokenValid(false);
          setValidatingToken(false);
          return;
        }

        console.log("✅ Fluxo de recovery detectado");

        // Check if the user has a valid recovery session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Sessão atual:", {
          session: currentSession,
          sessionError,
          userAud: currentSession?.user?.aud,
          accessToken: currentSession?.access_token ? "presente" : "ausente"
        });
        
        // Se há uma sessão ou token válido, aceitar
        if (currentSession || extractedTokenFromHash) {
          console.log("✅ Sessão ou token de recuperação válido detectado");
          
          // Set recovery mode for all tabs
          if (setRecoveryMode) {
            setRecoveryMode(true);
          } else {
            // Fallback if hook is not available
            recoveryModeUtils.setRecoveryMode(true);
          }
          
          setTokenValid(true);
        } else {
          console.log("❌ Nenhuma sessão válida ou token encontrado");
          setError("Link inválido ou expirado. Solicite um novo link de recuperação de senha.");
          setTokenValid(false);
        }
      } catch (error) {
        console.error("❌ Erro ao validar token:", error);
        setError("Link inválido ou expirado. Solicite um novo link de recuperação de senha.");
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
        console.log("=== FIM DA VALIDAÇÃO ===");
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
