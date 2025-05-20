
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Menu, 
  User, 
  ChevronDown, 
  Search,
  LogOut,
  Settings,
  Home
} from "lucide-react";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Helper to determine area
  const isAdmin = location.pathname.includes("/admin");
  const isStudent = location.pathname.includes("/student");
  const isHome = location.pathname === "/";

  // Only show area-specific elements when in that area
  const showAreaSpecific = isAdmin || isStudent;
  
  const headerAnimation = {
    hidden: { opacity: 0, y: -10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <header className={`bg-white border-b border-border fixed top-0 left-0 w-full z-50 h-12 shadow-sm ${isAdmin ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : isStudent ? 'bg-gradient-to-r from-portal-light to-purple-50' : ''}`}>
      <motion.div 
        className="container mx-auto flex items-center justify-between h-full px-4"
        variants={headerAnimation}
        initial="hidden"
        animate="show"
      >
        {/* Logo and site title */}
        <motion.div className="flex items-center" variants={itemAnimation}>
          <Link to="/" className="flex items-center group">
            <span className={`text-lg font-bold transition-all duration-300 ${isAdmin ? 'text-blue-600' : 'text-portal-primary'} group-hover:scale-110`}>Portal</span>
            <span className={`text-lg font-normal transition-all duration-300 ${isAdmin ? 'text-indigo-600' : 'text-portal-dark'} group-hover:text-portal-primary`}>Edu</span>
          </Link>
        </motion.div>
        
        {/* Middle section - changes based on route */}
        <motion.div 
          className="hidden md:flex items-center flex-1 mx-8 justify-center"
          variants={itemAnimation}
        >
          {isHome && (
            <nav className="flex space-x-6">
              <Link to="/" className="text-portal-dark hover:text-portal-primary transition-colors flex items-center gap-1">
                <Home size={16} />
                <span>Home</span>
              </Link>
              <Link to="/student" className="text-portal-dark hover:text-portal-primary transition-colors flex items-center gap-1">
                <User size={16} />
                <span>Área do Aluno</span>
              </Link>
              <Link to="/admin" className="text-portal-dark hover:text-portal-primary transition-colors flex items-center gap-1">
                <Settings size={16} />
                <span>Área Admin</span>
              </Link>
            </nav>
          )}
          
          {showAreaSpecific && (
            <div className="relative">
              <div className="flex items-center">
                <span className={`font-medium ${isAdmin ? 'text-blue-600' : 'text-portal-primary'}`}>
                  {isAdmin ? 'Painel Administrativo' : 'Portal do Aluno'}
                </span>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Right section - notifications and user menu */}
        <div className="flex items-center space-x-2">
          {showAreaSpecific && (
            <>
              <motion.div variants={itemAnimation}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`relative h-8 w-8 rounded-full hover:bg-opacity-80 hover:scale-110 transition-transform ${isAdmin ? 'hover:bg-blue-100' : 'hover:bg-portal-light'}`}
                    >
                      <Bell className="h-4 w-4" />
                      <span className={`absolute top-0 right-0 h-2 w-2 ${isAdmin ? 'bg-blue-600' : 'bg-portal-danger'} rounded-full`}></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-80 p-0 overflow-hidden"
                    sideOffset={8}
                  >
                    <div className={`p-2 ${isAdmin ? 'bg-blue-600' : 'bg-portal-primary'} text-white font-medium`}>
                      <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-auto">
                      <DropdownMenuItem className="py-2 flex gap-3 items-start">
                        <div className={`p-2 rounded-full ${isAdmin ? 'bg-blue-100 text-blue-600' : 'bg-portal-light text-portal-primary'}`}>
                          <Bell size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">Novo fornecedor adicionado</span>
                          <span className="text-sm text-muted-foreground">Há 5 minutos</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-2 flex gap-3 items-start">
                        <div className={`p-2 rounded-full ${isAdmin ? 'bg-blue-100 text-blue-600' : 'bg-portal-light text-portal-primary'}`}>
                          <Bell size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">Nova avaliação recebida</span>
                          <span className="text-sm text-muted-foreground">Há 1 hora</span>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className={`justify-center ${isAdmin ? 'text-blue-600' : 'text-portal-primary'} font-medium`}>
                      Ver todas
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              
              <motion.div variants={itemAnimation}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 rounded-full hover:bg-opacity-80 hover:scale-110 transition-transform ${isAdmin ? 'hover:bg-blue-100' : 'hover:bg-portal-light'}`}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end"
                    className="w-56"
                    sideOffset={8}
                  >
                    <div className={`p-3 ${isAdmin ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-portal-primary to-portal-accent'} text-white`}>
                      <DropdownMenuLabel className="p-0">
                        <div className="flex flex-col">
                          <span className="font-medium">Minha Conta</span>
                          <span className="text-xs text-white/80">nome.usuario@email.com</span>
                        </div>
                      </DropdownMenuLabel>
                    </div>
                    <div className="p-1">
                      <DropdownMenuItem className="px-3 py-2 my-1 rounded-md cursor-pointer flex gap-2 transition-colors">
                        <Home size={16} />
                        <Link to={isAdmin ? "/admin" : "/student"} className="w-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-3 py-2 my-1 rounded-md cursor-pointer flex gap-2 transition-colors">
                        <Settings size={16} />
                        <Link to={isAdmin ? "/admin/settings" : "/student/settings"} className="w-full">
                          Configurações
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="px-3 py-2 my-1 rounded-md cursor-pointer flex gap-2 text-portal-danger hover:text-portal-danger transition-colors">
                        <LogOut size={16} />
                        <Link to="/" className="w-full">
                          Sair
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </>
          )}
          
          {/* Mobile menu button - only visible on small screens */}
          <motion.div variants={itemAnimation}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-8 w-8"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div 
          className="md:hidden bg-white absolute left-0 right-0 top-12 shadow-lg z-50 border-t border-gray-100"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 space-y-3">
            {isHome && (
              <>
                <Link to="/" className="block py-2 px-4 rounded-md hover:bg-gray-100 text-portal-dark">
                  Home
                </Link>
                <Link to="/student" className="block py-2 px-4 rounded-md hover:bg-gray-100 text-portal-dark">
                  Área do Aluno
                </Link>
                <Link to="/admin" className="block py-2 px-4 rounded-md hover:bg-gray-100 text-portal-dark">
                  Área Admin
                </Link>
              </>
            )}
            
            {isStudent && (
              <>
                <Link to="/student" className="block py-2 px-4 rounded-md hover:bg-portal-light text-portal-dark">Dashboard</Link>
                <Link to="/student/suppliers" className="block py-2 px-4 rounded-md hover:bg-portal-light text-portal-dark">Fornecedores</Link>
                <Link to="/student/partners" className="block py-2 px-4 rounded-md hover:bg-portal-light text-portal-dark">Parceiros</Link>
                <Link to="/student/tools" className="block py-2 px-4 rounded-md hover:bg-portal-light text-portal-dark">Ferramentas</Link>
                <Link to="/student/my-suppliers" className="block py-2 px-4 rounded-md hover:bg-portal-light text-portal-dark">Meus Fornecedores</Link>
                <Link to="/student/settings" className="block py-2 px-4 rounded-md hover:bg-portal-light text-portal-dark">Configurações</Link>
              </>
            )}
            
            {isAdmin && (
              <>
                <Link to="/admin" className="block py-2 px-4 rounded-md hover:bg-blue-50 text-portal-dark">Dashboard</Link>
                <Link to="/admin/users" className="block py-2 px-4 rounded-md hover:bg-blue-50 text-portal-dark">Gestão de Usuários</Link>
                <Link to="/admin/gestao-alunos" className="block py-2 px-4 rounded-md hover:bg-blue-50 text-portal-dark">Gestão de Alunos</Link>
                <Link to="/admin/registers" className="block py-2 px-4 rounded-md hover:bg-blue-50 text-portal-dark">Cadastros</Link>
                <Link to="/admin/tasks" className="block py-2 px-4 rounded-md hover:bg-blue-50 text-portal-dark">Lista de Tarefas</Link>
                <Link to="/admin/crm" className="block py-2 px-4 rounded-md hover:bg-blue-50 text-portal-dark">CRM / Gestão de Leads</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
