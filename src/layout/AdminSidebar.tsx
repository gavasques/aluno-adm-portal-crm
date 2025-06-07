
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Package, 
  Settings, 
  FileText,
  CreditCard,
  Bell,
  ShieldCheck,
  UserCheck,
  Calendar,
  Bookmark,
  MessageSquare,
  BarChart3,
  GraduationCap,
  Award,
  BookOpen,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

const AdminSidebar = () => {
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const [mentoringOpen, setMentoringOpen] = useState(false);
  const [crmOpen, setCrmOpen] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      title: 'Usuários',
      href: '/admin/users',
      icon: Users
    },
    {
      title: 'CRM',
      icon: MessageSquare,
      isCollapsible: true,
      isOpen: crmOpen,
      setIsOpen: setCrmOpen,
      children: [
        { title: 'Dashboard', href: '/admin/crm', icon: LayoutDashboard },
        { title: 'Leads', href: '/admin/crm/leads', icon: Users },
        { title: 'Relatórios', href: '/admin/crm/reports', icon: BarChart3 },
        { title: 'Configurações', href: '/admin/crm/settings', icon: Settings }
      ]
    },
    {
      title: 'Mentoria',
      icon: GraduationCap,
      isCollapsible: true,
      isOpen: mentoringOpen,
      setIsOpen: setMentoringOpen,
      children: [
        { title: 'Dashboard', href: '/admin/mentoria', icon: LayoutDashboard },
        { title: 'Catálogo', href: '/admin/mentoria/catalogo', icon: BookOpen },
        { title: 'Inscrições', href: '/admin/mentoria/inscricoes', icon: UserCheck },
        { title: 'Sessões', href: '/admin/mentoria/sessoes', icon: Calendar },
        { title: 'Materiais', href: '/admin/mentoria/materiais', icon: Bookmark }
      ]
    },
    {
      title: 'Fornecedores',
      href: '/admin/suppliers',
      icon: Building
    },
    {
      title: 'Parceiros',
      href: '/admin/partners',
      icon: Package
    },
    {
      title: 'Tarefas',
      href: '/admin/tasks',
      icon: FileText
    },
    {
      title: 'Créditos',
      href: '/admin/credits',
      icon: CreditCard
    },
    {
      title: 'Notificações',
      href: '/admin/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      title: 'Permissões',
      href: '/admin/permissions',
      icon: ShieldCheck
    },
    {
      title: 'Configurações',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  const isActiveLink = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const renderMenuItem = (item: any) => {
    if (item.isCollapsible) {
      return (
        <Collapsible key={item.title} open={item.isOpen} onOpenChange={item.setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 h-10",
                "hover:bg-gray-100 hover:text-gray-900",
                item.children?.some((child: any) => isActiveLink(child.href)) && "bg-blue-50 text-blue-600"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            <div className="ml-6 space-y-1">
              {item.children?.map((child: any) => (
                <Link
                  key={child.href}
                  to={child.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                    "hover:bg-gray-100 hover:text-gray-900",
                    isActiveLink(child.href) ? "bg-blue-50 text-blue-600" : "text-gray-600"
                  )}
                >
                  <child.icon className="h-4 w-4" />
                  {child.title}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
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
        {item.badge && (
          <Badge variant="destructive" className="ml-auto">
            {item.badge > 9 ? '9+' : item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Link to="/admin" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/a9512e96-66c6-47b8-a7c6-5f1820a6c1a3.png"
            alt="Logo" 
            className="h-8"
          />
          <span className="font-semibold text-gray-900">Admin</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map(renderMenuItem)}
      </nav>
    </div>
  );
};

export default AdminSidebar;
