
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Bell, User, LogOut, Settings, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  
  // Detectar se o usuário está na área de admin ou aluno
  useEffect(() => {
    setIsAdmin(location.pathname.includes("/admin"));
  }, [location]);
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-semibold">
          <img 
            src="/lovable-uploads/a9512e96-66c6-47b8-a7c6-5f1820a6c1a3.png"
            alt="Guilherme Vasques Logo" 
            className="h-8"
          />
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full h-8 w-8 ml-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.email ? user.email.charAt(0).toUpperCase() : (isAdmin ? "A" : "U")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="bg-blue-600 text-white p-4 -mt-1 -mx-1 rounded-t-md">
              <div className="font-medium">Minha Conta</div>
              <div className="text-sm text-blue-100">
                {user?.email || (isAdmin ? "admin@portaledu.com" : "aluno@portaledu.com")}
              </div>
            </div>
            
            <DropdownMenuItem asChild>
              <Link to={isAdmin ? "/admin" : "/aluno"} className="flex cursor-pointer items-center gap-2">
                <User className="h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to={isAdmin ? "/admin/configuracoes" : "/aluno/configuracoes"} className="flex cursor-pointer items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/aluno" className="flex cursor-pointer items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Ir para Área do Aluno
                </Link>
              </DropdownMenuItem>
            )}
            
            {!isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex cursor-pointer items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Ir para Área ADM
                </Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 cursor-pointer">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
