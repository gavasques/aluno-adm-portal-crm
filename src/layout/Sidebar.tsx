import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Calendar, Users, GraduationCap, Book, ListChecks, BarChart, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const studentMenuItems = [
    {
      href: '/mentorias',
      icon: GraduationCap,
      label: 'Mentorias',
      description: 'Encontre a mentoria ideal para você'
    },
    {
      href: '/minhas-mentorias',
      icon: Book,
      label: 'Minhas Mentorias',
      description: 'Acompanhe suas mentorias e agendamentos'
    },
    {
      href: '/calendario',
      icon: Calendar,
      label: 'Calendário',
      description: 'Visualize seus agendamentos e compromissos'
    },
  ];

  const adminMenuItems = [
    {
      href: '/admin/usuarios',
      icon: Users,
      label: 'Usuários',
      description: 'Gerenciar usuários do sistema'
    },
    {
      href: '/admin/mentorias',
      icon: GraduationCap,
      label: 'Mentorias',
      description: 'Gerenciar catálogo de mentorias'
    },
    {
      href: '/admin/inscricoes',
      icon: ListChecks,
      label: 'Inscrições',
      description: 'Gerenciar inscrições de alunos'
    },
    {
      href: '/admin/relatorios',
      icon: BarChart,
      label: 'Relatórios',
      description: 'Visualizar relatórios e estatísticas'
    },
    {
      href: '/admin/calendly-config',
      icon: Calendar,
      label: 'Configurações Calendly',
      description: 'Gerenciar credenciais do Calendly'
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navegue pelas opções do sistema.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-1 py-4">
          <div className="px-6">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-2">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full border-b pb-2">
            <AccordionItem value="student">
              <AccordionTrigger className="hover:bg-gray-100 px-6 py-2 font-medium">
                Menu do Aluno
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 py-2">
                  {studentMenuItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-6 py-2 text-sm rounded-md
                        ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`
                      }
                      onClick={onClose}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {user?.role === 'Admin' && (
            <Accordion type="single" collapsible className="w-full border-b pb-2">
              <AccordionItem value="admin">
                <AccordionTrigger className="hover:bg-gray-100 px-6 py-2 font-medium">
                  Menu do Administrador
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 py-2">
                    {adminMenuItems.map((item) => (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-6 py-2 text-sm rounded-md
                          ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`
                        }
                        onClick={onClose}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <div className="mt-auto p-6">
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
