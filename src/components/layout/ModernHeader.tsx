
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Settings, User, ChevronDown, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModernButton } from '@/components/ui/modern-button';

interface ModernHeaderProps {
  isAdmin?: boolean;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({ isAdmin = false }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (isAdmin) {
      return segments.map(segment => {
        switch (segment) {
          case 'admin': return 'Administração';
          case 'dashboard': return 'Dashboard';
          case 'usuarios': return 'Usuários';
          case 'fornecedores': return 'Fornecedores';
          case 'mentoria': return 'Mentoria';
          default: return segment.charAt(0).toUpperCase() + segment.slice(1);
        }
      });
    } else {
      return segments.map(segment => {
        switch (segment) {
          case 'aluno': return 'Aluno';
          case 'dashboard': return 'Dashboard';
          case 'fornecedores': return 'Fornecedores';
          case 'meus-fornecedores': return 'Meus Fornecedores';
          case 'parceiros': return 'Parceiros';
          case 'ferramentas': return 'Ferramentas';
          default: return segment.charAt(0).toUpperCase() + segment.slice(1);
        }
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSwitchToAdmin = () => {
    navigate('/admin/dashboard');
  };

  const handleSwitchToStudent = () => {
    navigate('/aluno/dashboard');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full glass border-b border-white/10 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {getBreadcrumb().map((crumb, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-2 text-slate-400">/</span>}
                <span className={index === getBreadcrumb().length - 1 ? 'text-slate-900 dark:text-white font-medium' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <ModernButton variant="glass" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <AnimatePresence>
                {notificationCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-white">{notificationCount}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModernButton>
          </motion.div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-2 rounded-xl glass-button cursor-pointer"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-white/20">
                    <AvatarImage src="" alt={user?.email || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                      {user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {user?.email?.split('@')[0] || "Usuário"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAdmin ? 'Administrador' : 'Aluno'}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass border-white/20 backdrop-blur-xl">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-3 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-3 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              {!isAdmin ? (
                <DropdownMenuItem onClick={handleSwitchToAdmin} className="cursor-pointer">
                  <Shield className="mr-3 h-4 w-4 text-blue-500" />
                  <span>Área Administrativa</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleSwitchToStudent} className="cursor-pointer">
                  <User className="mr-3 h-4 w-4 text-green-500" />
                  <span>Área do Aluno</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};
