
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const EmailConfirmation = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Verificar se temos os parâmetros necessários para confirmação
        const token = searchParams.get('token') || searchParams.get('access_token');
        const type = searchParams.get('type');
        
        // Extrair token do hash se necessário
        const hashParams = window.location.hash;
        let hashToken = null;
        if (hashParams) {
          const accessTokenMatch = hashParams.match(/access_token=([^&]+)/);
          hashToken = accessTokenMatch ? accessTokenMatch[1] : null;
        }

        const finalToken = token || hashToken;
        
        console.log("Confirmação de email - parâmetros:", { 
          token: finalToken ? "presente" : "ausente",
          type,
          hashParams 
        });

        if (!finalToken) {
          setError("Token de confirmação não encontrado.");
          setLoading(false);
          return;
        }

        // Verificar se é realmente uma confirmação de email (não recovery)
        if (type === 'recovery') {
          console.log("Detectado tipo recovery - redirecionando para reset password");
          navigate("/reset-password");
          return;
        }

        // Aguardar um momento para o Supabase processar
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar se o usuário já está logado após a confirmação
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Email confirmado com sucesso - usuário logado");
          setSuccess(true);
          setLoading(false);
          
          // Redirecionar após 2 segundos para a área apropriada
          setTimeout(() => {
            navigate("/student");
          }, 2000);
        } else {
          setError("Houve um problema na confirmação do email. Tente fazer login normalmente.");
          setLoading(false);
        }

      } catch (error: any) {
        console.error("Erro na confirmação de email:", error);
        setError("Erro ao confirmar email. Tente novamente ou faça login normalmente.");
        setLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  // Se o usuário já estiver logado, redirecionar
  useEffect(() => {
    if (user && !loading) {
      navigate("/student");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-800 to-black">
        <div className="bg-blue-950/80 backdrop-blur-md rounded-xl border border-blue-800/30 shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Confirmando seu email...
            </h2>
            <p className="text-blue-200">
              Aguarde enquanto validamos sua conta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-800 to-black">
        <div className="bg-blue-950/80 backdrop-blur-md rounded-xl border border-blue-800/30 shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Email confirmado com sucesso!
            </h2>
            <p className="text-blue-200 mb-4">
              Sua conta foi ativada. Você será redirecionado em instantes.
            </p>
            <div className="text-sm text-blue-300">
              Redirecionando para a área do aluno...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-800 to-black">
      <div className="bg-blue-950/80 backdrop-blur-md rounded-xl border border-blue-800/30 shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Erro na confirmação
          </h2>
          <p className="text-blue-200 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
