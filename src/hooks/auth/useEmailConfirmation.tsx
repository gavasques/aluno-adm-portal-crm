
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useEmailConfirmation = () => {
  const [validating, setValidating] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const validateConfirmation = async () => {
      setValidating(true);
      
      try {
        // Extrair parâmetros da URL
        const typeParam = searchParams.get('type');
        const tokenParam = searchParams.get('token') || searchParams.get('access_token');
        const hashParams = window.location.hash;
        
        // Função para extrair token do hash
        const extractTokenFromHash = () => {
          if (!hashParams) return null;
          const accessTokenMatch = hashParams.match(/access_token=([^&]+)/);
          return accessTokenMatch ? accessTokenMatch[1] : null;
        };
        
        const extractedToken = extractTokenFromHash();
        const finalToken = tokenParam || extractedToken;
        
        console.log("Validação de confirmação de email:", {
          typeParam,
          hasToken: !!finalToken,
          hashParams: !!hashParams
        });

        // Se não há token, é inválido
        if (!finalToken) {
          setError("Link de confirmação inválido ou expirado.");
          setValidating(false);
          return;
        }

        // Se é um token de recovery, não deve ser processado aqui
        if (typeParam === 'recovery') {
          setError("Este é um link de recuperação de senha. Use a página de redefinição de senha.");
          setValidating(false);
          return;
        }

        // Verificar se a sessão foi estabelecida após clique no link
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Confirmação de email bem-sucedida");
          setConfirmed(true);
        } else {
          // Tentar aguardar um pouco mais para a sessão ser estabelecida
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          
          if (retrySession?.user) {
            console.log("Confirmação de email bem-sucedida (tentativa 2)");
            setConfirmed(true);
          } else {
            setError("Não foi possível confirmar o email. Tente fazer login normalmente.");
          }
        }
        
      } catch (error: any) {
        console.error("Erro na validação de confirmação:", error);
        setError("Erro ao processar confirmação de email.");
      } finally {
        setValidating(false);
      }
    };

    validateConfirmation();
  }, [searchParams]);

  return {
    validating,
    confirmed,
    error
  };
};
