
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAllowedMenus } from '@/hooks/useAllowedMenus';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useEffect, useState } from "react";

const menuPathToKey: Record<string, string> = {
  "/student": "dashboard",
  "/student/suppliers": "suppliers",
  "/student/partners": "partners",
  "/student/tools": "tools",
  "/student/my-suppliers": "my-suppliers",
  "/student/settings": "settings"
};

const StudentRouteGuard = () => {
  const location = useLocation();
  const { hasAccess, loading: menuLoading } = useAllowedMenus();
  const { profile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  const menuKey = menuPathToKey[location.pathname];
  
  useEffect(() => {
    // Verificar acesso apenas quando os dados estiverem carregados e não for admin
    if (!menuLoading && !profileLoading && profile && profile.role !== 'Admin') {
      if (menuKey && !hasAccess(menuKey)) {
        toast({
          title: 'Acesso negado',
          description: 'Você não tem permissão para acessar esta página.',
          variant: 'destructive',
        });
        setShouldRedirect(true);
      }
    }
  }, [menuKey, hasAccess, profile, menuLoading, profileLoading, toast]);
  
  if (menuLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Admins têm acesso completo
  if (profile?.role === 'Admin') {
    return <Outlet />;
  }
  
  // Redirecionar para o dashboard se não tiver acesso
  if (shouldRedirect) {
    return <Navigate to="/student" replace />;
  }
  
  return <Outlet />;
};

export default StudentRouteGuard;
