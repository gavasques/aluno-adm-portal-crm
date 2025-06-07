
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Building2, 
  Users, 
  Wrench, 
  GraduationCap, 
  Bot, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StudentSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/aluno', // Corrigido de '/aluno/dashboard' para '/aluno'
      active: location.pathname === '/aluno'
    },
    {
      label: 'Meus Créditos',
      icon: CreditCard,
      href: '/aluno/creditos',
      active: location.pathname === '/aluno/creditos'
    },
    {
      label: 'Fornecedores',
      icon: Building2,
      href: '/aluno/fornecedores',
      active: location.pathname === '/aluno/fornecedores'
    },
    {
      label: 'Meus Fornecedores',
      icon: Building2,
      href: '/aluno/meus-fornecedores',
      active: location.pathname === '/aluno/meus-fornecedores'
    },
    {
      label: 'Parceiros',
      icon: Users,
      href: '/aluno/parceiros',
      active: location.pathname === '/aluno/parceiros'
    },
    {
      label: 'Ferramentas',
      icon: Wrench,
      href: '/aluno/ferramentas',
      active: location.pathname === '/aluno/ferramentas'
    },
    {
      label: 'Mentoria',
      icon: GraduationCap,
      href: '/aluno/mentoria',
      active: location.pathname === '/aluno/mentoria'
    },
    {
      label: 'Livi AI',
      icon: Bot,
      href: '/aluno/livi-ai',
      active: location.pathname === '/aluno/livi-ai'
    },
    {
      label: 'Configurações',
      icon: Settings,
      href: '/aluno/configuracoes',
      active: location.pathname === '/aluno/configuracoes'
    }
  ];

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900">Portal do Aluno</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.active
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    isCollapsed ? "justify-center" : ""
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default StudentSidebar;
