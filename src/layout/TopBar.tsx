
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Users, ChevronDown, Bell } from "lucide-react";
import { useSignInOut } from "@/hooks/auth/useBasicAuth/useSignInOut";
import { usePermissions } from "@/hooks/usePermissions";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = () => {
  const { user } = useAuth();
  const { signOut } = useSignInOut();
  const { permissions } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminArea = location.pathname.startsWith("/admin");
  const isStudentArea = location.pathname.startsWith("/aluno");

  const getTitle = () => {
    if (isAdminArea) {
      return "Portal Administrativo";
    }
    if (isStudentArea) {
      return "Portal do Aluno";
    }
    return "Portal";
  };

  const handleNavigateToAdmin = () => {
    navigate("/admin");
  };

  const handleNavigateToStudent = () => {
    navigate("/aluno");
  };

  const handleSettings = () => {
    if (isAdminArea) {
      navigate("/admin/configuracoes");
    } else {
      navigate("/aluno/configuracoes");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="lg:hidden" />
          <div className="font-semibold text-lg text-portal-dark">
            {getTitle()}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Botão de Notificações */}
          <Button variant="outline" className="flex items-center gap-2 relative">
            <Bell className="h-4 w-4" />
            Notificações
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Navegação entre áreas */}
                {permissions.hasAdminAccess && isStudentArea && (
                  <DropdownMenuItem onClick={handleNavigateToAdmin}>
                    <Users className="h-4 w-4 mr-2" />
                    Ir para Área Administrativa
                  </DropdownMenuItem>
                )}
                {isAdminArea && (
                  <DropdownMenuItem onClick={handleNavigateToStudent}>
                    <User className="h-4 w-4 mr-2" />
                    Ir para Área do Aluno
                  </DropdownMenuItem>
                )}
                
                {/* Configurações */}
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Logout */}
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
