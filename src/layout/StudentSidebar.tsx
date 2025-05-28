
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Home, Settings, Users, BarChart, Wrench, Package, Bell, LogOut, User, GraduationCap } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/auth";
import { useSignInOut } from "@/hooks/auth/useBasicAuth/useSignInOut";
import { useActiveMentoring } from "@/hooks/useActiveMentoring";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  menuKey?: string;
  showAlways?: boolean;
  customCondition?: boolean;
}

const NavItem = ({
  href,
  icon: Icon,
  children,
  menuKey,
  showAlways = false,
  customCondition
}: NavItemProps) => {
  const { pathname } = useLocation();
  const { permissions } = usePermissions();
  const isActive = pathname === href;
  
  // Check custom condition first, then permissions
  if (customCondition !== undefined && !customCondition) {
    return null;
  }
  
  if (!showAlways && menuKey && !permissions.allowedMenus.includes(menuKey)) {
    return null;
  }
  
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors",
        isActive
          ? "bg-blue-100 text-blue-700 border-l-2 border-blue-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Link>
  );
};

const sidebarAnimation = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

const StudentSidebar = () => {
  const { permissions, loading } = usePermissions();
  const { user } = useAuth();
  const { signOut } = useSignInOut();
  const { hasActiveMentoring, loading: mentoringLoading } = useActiveMentoring();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminArea = location.pathname.startsWith("/admin");
  const isStudentArea = location.pathname.startsWith("/aluno");

  const handleNavigateToAdmin = () => {
    navigate("/admin");
  };

  const handleSettings = () => {
    navigate("/aluno/configuracoes");
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    return user?.user_metadata?.name || user?.email || "Usuário";
  };

  // Verificar se deve mostrar o menu de mentorias
  const shouldShowMentoring = () => {
    // Se tem permissão admin, sempre mostrar
    if (permissions.hasAdminAccess) {
      return true;
    }
    
    // Se tem a permissão específica do menu, mostrar
    if (permissions.allowedMenus.includes('student-mentoring')) {
      return true;
    }
    
    // Para alunos regulares, só mostrar se tem mentoria ativa
    return hasActiveMentoring;
  };
  
  if (loading) {
    return (
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto resize-x min-w-[200px] max-w-[400px]">
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto flex flex-col resize-x min-w-[200px] max-w-[400px]">
      {/* Header da sidebar com logo */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/a9512e96-66c6-47b8-a7c6-5f1820a6c1a3.png"
              alt="Guilherme Vasques Logo" 
              className="h-7"
            />
          </Link>
          
          <Button variant="ghost" size="icon" className="relative text-gray-600 hover:bg-gray-100">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </div>
      </div>

      {/* Menu de navegação */}
      <div className="flex-1 p-3">
        <motion.div variants={sidebarAnimation} initial="hidden" animate="show">
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Principal
            </h3>
            <nav className="space-y-1">
              <motion.div variants={itemAnimation}>
                <NavItem href="/aluno" icon={Home} showAlways={true}>Dashboard</NavItem>
              </motion.div>
              <motion.div variants={itemAnimation}>
                <NavItem href="/aluno/configuracoes" icon={Settings} menuKey="settings">Configurações</NavItem>
              </motion.div>
            </nav>
          </div>
          
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Minha Área
            </h3>
            <nav className="space-y-1">
              <motion.div variants={itemAnimation}>
                <NavItem href="/aluno/meus-fornecedores" icon={Package} menuKey="my-suppliers">Meus Fornecedores</NavItem>
              </motion.div>
              <motion.div variants={itemAnimation}>
                {mentoringLoading ? (
                  <div className="flex items-center gap-2 rounded-md px-3 py-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ) : (
                  <NavItem 
                    href="/aluno/mentorias" 
                    icon={GraduationCap} 
                    customCondition={shouldShowMentoring()}
                  >
                    Minhas Mentorias
                  </NavItem>
                )}
              </motion.div>
            </nav>
          </div>
          
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Geral
            </h3>
            <nav className="space-y-1">
              <motion.div variants={itemAnimation}>
                <NavItem href="/aluno/fornecedores" icon={Users} menuKey="suppliers">Fornecedores</NavItem>
              </motion.div>
              <motion.div variants={itemAnimation}>
                <NavItem href="/aluno/parceiros" icon={BarChart} menuKey="partners">Parceiros</NavItem>
              </motion.div>
              <motion.div variants={itemAnimation}>
                <NavItem href="/aluno/ferramentas" icon={Wrench} menuKey="tools">Ferramentas</NavItem>
              </motion.div>
            </nav>
          </div>
        </motion.div>
      </div>

      {/* Menu do usuário na parte inferior */}
      <div className="p-3 border-t border-gray-100 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-2 text-gray-700 hover:bg-gray-50">
              <Avatar className="h-7 w-7 mr-2">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-xs">
                <span className="font-medium">{getUserName()}</span>
                <span className="text-gray-500 text-xs truncate">{user?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="bg-blue-50 text-blue-700 p-3 -mt-1 -mx-1 rounded-t-md">
              <div className="font-medium text-sm">Minha Conta</div>
              <div className="text-xs text-blue-600">
                {user?.email || "aluno@portaledu.com"}
              </div>
            </div>
            
            <DropdownMenuItem asChild>
              <Link to="/aluno" className="flex cursor-pointer items-center gap-2">
                <User className="h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleSettings} className="flex cursor-pointer items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            
            {permissions.hasAdminAccess && (
              <DropdownMenuItem onClick={handleNavigateToAdmin} className="flex cursor-pointer items-center gap-2">
                <Users className="h-4 w-4" />
                Ir para Área Administrativa
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600 cursor-pointer">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default StudentSidebar;
