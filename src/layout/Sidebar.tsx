
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  Wrench, 
  Settings, 
  CreditCard,
  Bot,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/usePermissions';

interface SidebarProps {
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin }) => {
  const location = useLocation();
  const { permissions } = usePermissions();

  console.log("=== SIDEBAR DEBUG ===");
  console.log("IsAdmin:", isAdmin);
  console.log("Current path:", location.pathname);
  console.log("Permissions:", permissions);
  console.log("====================");

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Usuários', path: '/admin/usuarios' },
    { icon: Users, label: 'Alunos', path: '/admin/alunos' },
    { icon: Building2, label: 'Fornecedores', path: '/admin/fornecedores' },
    { icon: Users, label: 'Parceiros', path: '/admin/parceiros' },
    { icon: Wrench, label: 'Ferramentas', path: '/admin/ferramentas' },
    { icon: BookOpen, label: 'Notícias', path: '/admin/noticias' },
    { icon: GraduationCap, label: 'Mentorias', path: '/admin/mentorias' },
    { icon: CreditCard, label: 'Créditos', path: '/admin/creditos' },
    { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' }
  ];

  const studentMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/aluno' },
    { icon: Building2, label: 'Fornecedores', path: '/aluno/fornecedores' },
    { icon: Users, label: 'Parceiros', path: '/aluno/parceiros' },
    { icon: Wrench, label: 'Ferramentas', path: '/aluno/ferramentas' },
    { icon: Building2, label: 'Meus Fornecedores', path: '/aluno/meus-fornecedores' },
    { icon: GraduationCap, label: 'Mentoria', path: '/aluno/mentoria' },
    { icon: Bot, label: 'Livi AI', path: '/aluno/livi-ai' },
    { icon: CreditCard, label: 'Créditos', path: '/aluno/creditos' },
    { icon: Settings, label: 'Configurações', path: '/aluno/configuracoes' }
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  const isActiveRoute = (path: string) => {
    if (path === '/admin' || path === '/aluno') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <img 
          src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" 
          alt="Logo" 
          className="h-10 object-contain" 
        />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isAdmin ? 'Área Administrativa' : 'Área do Aluno'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
