
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GridBackground } from "@/components/ui/grid-background";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verificando autenticação...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setMessage("Erro na autenticação. Redirecionando para o login...");
          setTimeout(() => navigate("/"), 2000);
        } else if (data.session) {
          setMessage("Autenticação bem-sucedida! Redirecionando...");
          // Check for the last part of the URL to determine where to redirect
          const path = window.location.hash;
          const redirectTo = path.includes('/admin') ? '/admin' : '/student';
          setTimeout(() => navigate(redirectTo), 1000);
        } else {
          setMessage("Nenhuma sessão encontrada. Redirecionando para o login...");
          setTimeout(() => navigate("/"), 2000);
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
      <GridBackground />
      
      <div className="relative z-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2 text-white">Processando</h2>
          <p className="text-blue-200">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
