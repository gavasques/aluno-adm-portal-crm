
import React from "react";
import {
  LayoutDashboard,
  Building2,
  Heart,
  Handshake,
  Wrench,
  GraduationCap,
  Settings,
  CreditCard,
  ChevronDown,
  Shield,
  LogOut,
  Sparkles,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentSidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const generalMenuItems = [
    {
      title: "Dashboard",
      href: "/aluno/dashboard",
      icon: LayoutDashboard,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Meus Créditos",
      href: "/aluno/creditos",
      icon: CreditCard,
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  const resourcesMenuItems = [
    {
      title: "Fornecedores",
      href: "/aluno/fornecedores",
      icon: Building2,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Parceiros",
      href: "/aluno/parceiros",
      icon: Handshake,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Ferramentas",
      href: "/aluno/ferramentas",
      icon: Wrench,
      gradient: "from-pink-500 to-pink-600",
    },
  ];

  const myAreaMenuItems = [
    {
      title: "Meus Fornecedores",
      href: "/aluno/meus-fornecedores",
      icon: Heart,
      gradient: "from-red-500 to-red-600",
    },
    {
      title: "Mentoria",
      href: "/aluno/mentoria",
      icon: GraduationCap,
      gradient: "from-indigo-500 to-indigo-600",
    },
  ];

  const settingsMenuItems = [
    {
      title: "Configurações",
      href: "/aluno/configuracoes",
      icon: Settings,
      gradient: "from-slate-500 to-slate-600",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleGoToAdmin = () => {
    navigate("/admin/dashboard");
  };

  const renderMenuGroup = (title: string, items: any[]) => (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 px-4 mb-3">
        <Sparkles className="h-3 w-3 text-blue-500" />
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-1 px-2">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center space-x-3 px-4 py-3 mx-1 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 shadow-modern-1"
                    : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Icon with gradient background */}
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient} shadow-modern-1 group-hover:shadow-modern-2 transition-shadow`}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  
                  <span className="truncate font-medium">{item.title}</span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/20 flex flex-col z-50 backdrop-blur-xl"
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Logo */}
      <motion.div 
        className="p-6 border-b border-white/10 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <img 
          src="/lovable-uploads/6b3114e7-0682-4946-bc7b-d7700403a1e8.png" 
          alt="Portal do Aluno" 
          className="h-8 w-auto filter drop-shadow-lg"
        />
      </motion.div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {renderMenuGroup("Geral", generalMenuItems)}
        {renderMenuGroup("Recursos", resourcesMenuItems)}
        {renderMenuGroup("Minha Área", myAreaMenuItems)}
        {renderMenuGroup("Sistema", settingsMenuItems)}
      </nav>

      {/* User Menu */}
      <motion.div 
        className="p-4 border-t border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between p-3 rounded-xl glass-button transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-8 w-8 ring-2 ring-white/20">
                  <AvatarImage src="" alt={user?.email || "Aluno"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                    {user?.email?.charAt(0)?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {user?.email?.split('@')[0] || "Aluno"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Online
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass border-white/20 backdrop-blur-xl">
            <DropdownMenuItem onClick={handleGoToAdmin} className="cursor-pointer group">
              <Shield className="mr-3 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium">Área Administrativa</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400 group">
              <LogOut className="mr-3 h-4 w-4 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
              <span className="font-medium">Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-44 right-2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
    </motion.div>
  );
};

export default StudentSidebar;
