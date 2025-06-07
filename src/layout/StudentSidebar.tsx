
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Wrench, 
  CreditCard,
  Bot,
  GraduationCap,
  Settings,
  BookOpen
} from 'lucide-react';

const StudentSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/aluno',
      icon: LayoutDashboard,
      exact: true
    },
    {
      title: 'Meus Créditos',
      href: '/aluno/creditos',
      icon: CreditCard
    },
    {
      title: 'Fornecedores',
      href: '/aluno/fornecedores',
      icon: Building
    },
    {
      title: 'Parceiros',
      href: '/aluno/parceiros',
      icon: Users
    },
    {
      title: 'Ferramentas',
      href: '/aluno/ferramentas',
      icon: Wrench
    },
    {
      title: 'Meus Fornecedores',
      href: '/aluno/meus-fornecedores',
      icon: BookOpen
    },
    {
      title: 'Mentoria',
      href: '/aluno/mentoria',
      icon: GraduationCap
    },
    {
      title: 'Livi AI',
      href: '/aluno/livi-ai',
      icon: Bot
    },
    {
      title: 'Configurações',
      href: '/aluno/configuracoes',
      icon: Settings
    }
  ];

  const isActiveLink = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Link to="/aluno" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/a9512e96-66c6-47b8-a7c6-5f1820a6c1a3.png"
            alt="Logo" 
            className="h-8"
          />
          <span className="font-semibold text-gray-900">Portal do Aluno</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              "hover:bg-gray-100 hover:text-gray-900",
              isActiveLink(item.href, item.exact) ? "bg-blue-50 text-blue-600" : "text-gray-600"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* Link para área administrativa (se tiver permissão) */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/admin"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <Users className="h-4 w-4" />
          <span>Área Administrativa</span>
        </Link>
      </div>
    </div>
  );
};

export default StudentSidebar;
