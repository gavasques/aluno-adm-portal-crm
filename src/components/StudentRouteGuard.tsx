
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAllowedMenus } from '@/hooks/useAllowedMenus';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/hooks/useProfile';

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
  const { hasAccess, loading } = useAllowedMenus();
  const { profile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  
  const menuKey = menuPathToKey[location.pathname];
  
  if (loading || profileLoading) {
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
  
  // Verificar acesso à rota atual
  if (menuKey && !hasAccess(menuKey)) {
    toast({
      title: 'Acesso negado',
      description: 'Você não tem permissão para acessar esta página.',
      variant: 'destructive',
    });
    
    // Redirecionar para o dashboard ou primeira página permitida
    return <Navigate to="/student" replace />;
  }
  
  return <Outlet />;
};

export default StudentRouteGuard;
