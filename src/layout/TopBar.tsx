
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Users, ChevronDown, Bell, Search, FileText } from "lucide-react";
import { useSignInOut } from "@/hooks/auth/useBasicAuth/useSignInOut";
import { usePermissions } from "@/hooks/usePermissions";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TopBar = () => {
  const { user } = useAuth();
  const { signOut } = useSignInOut();
  const { permissions } = usePermissions();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAdminArea = location.pathname.startsWith("/admin");
  const isStudentArea = location.pathname.startsWith("/aluno");

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

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    
    console.log("=== USUÁRIO CLICOU EM SAIR ===");
    setIsLoggingOut(true);
    
    try {
      await signOut();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return isAdminArea ? "A" : "U";
  };

  const getUserName = () => {
    return user?.user_metadata?.name || user?.email || "Usuário";
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-40 mb-2.5">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Get Report Button */}
          <Button variant="outline" className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border-gray-200">
            <FileText className="h-4 w-4" />
            Relatório
          </Button>

          {/* Notifications - Only show badge if there are unread notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-600 text-white text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium">{getUserName()}</div>
                    <div className="text-xs text-gray-500">
                      {isAdminArea ? "Administrador" : "Aluno"}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                {/* Navigation between areas */}
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
                
                {/* Settings */}
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Logout */}
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="text-red-600 focus:text-red-600"
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Saindo..." : "Sair"}
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
