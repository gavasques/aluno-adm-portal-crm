
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verificando autenticação...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();

        if (error) {
          setMessage("Erro na autenticação. Redirecionando para o login...");
          setTimeout(() => navigate("/"), 2000);
        } else {
          setMessage("Autenticação bem-sucedida! Redirecionando...");
          setTimeout(() => navigate("/admin"), 1000);
        }
      } catch (err) {
        console.error("Erro no callback de autenticação:", err);
        setMessage("Ocorreu um erro. Redirecionando para o login...");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Processando</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
