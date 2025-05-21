
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GridBackground } from "@/components/ui/grid-background";
import { useProfile } from "@/hooks/useProfile";
import { useAllowedMenus } from "@/hooks/useAllowedMenus";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verificando autenticação...");
  const { loadProfile, profile } = useProfile();
  const { allowedMenus, loading: menuLoading } = useAllowedMenus();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setMessage("Erro na autenticação. Redirecionando para o login...");
          setTimeout(() => navigate("/"), 2000);
          return;
        }
        
        if (data.session) {
          setMessage("Autenticação bem-sucedida! Carregando perfil...");
          
          // Carregar o perfil do usuário
          await loadProfile();
          
          // Determinar para onde redirecionar com base no papel do usuário no perfil
          setTimeout(() => {
            // Verificamos se o path contém alguma informação sobre para onde redirecionar
            const path = window.location.hash;
            
            // Se tivermos um redirecionamento específico no URL, usamos ele
            if (path.includes('/admin')) {
              navigate('/admin');
              return;
            }
            
            if (path.includes('/student')) {
              navigate('/student');
              return;
            }
            
            // Caso contrário, verificamos o papel do usuário no perfil
            if (profile?.role === 'Admin') {
              navigate('/admin');
            } else {
              navigate('/student');
            }
          }, 1000);
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
  }, [navigate, loadProfile, profile]);

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
