
import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  Wrench,
  GraduationCap,
  Settings,
  BarChart,
  Calendar,
  Shield,
  CreditCard,
  UserCog,
  Zap,
  BookOpenCheck,
  UserCheck,
  Users as UsersIcon,
  FolderOpen,
  CalendarDays,
  Users2,
  ClipboardCheck,
  Database,
  Cog,
  Newspaper
} from "lucide-react";
import { MenuItem, MenuGroup } from "./types";

export const mainMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Gestão de Usuários",
    href: "/admin/usuarios",
    icon: Users,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "CRM",
    href: "/admin/crm",
    icon: BarChart,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Lista de Tarefas",
    href: "/admin/tarefas",
    icon: Calendar,
    gradient: "from-orange-500 to-orange-600",
  },
];

export const mentoringMenuItems: MenuItem[] = [
  {
    title: "Dashboard de Mentorias",
    href: "/admin/mentorias",
    icon: GraduationCap,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Catálogo de Mentorias",
    href: "/admin/mentorias/catalogo",
    icon: BookOpenCheck,
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Inscrições Individuais",
    href: "/admin/inscricoes-individuais",
    icon: UserCheck,
    gradient: "from-green-500 to-green-600",
  },
  {
    title: "Inscrições em Grupo",
    href: "/admin/inscricoes-grupo",
    icon: UsersIcon,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Sessões Individuais",
    href: "/admin/sessoes-individuais",
    icon: CalendarDays,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Sessões em Grupo",
    href: "/admin/sessoes-grupo",
    icon: Users2,
    gradient: "from-violet-500 to-violet-600",
  },
  {
    title: "Central de Materiais",
    href: "/admin/mentorias/materiais",
    icon: FolderOpen,
    gradient: "from-teal-500 to-teal-600",
  },
];

export const managementMenuItems: MenuItem[] = [
  {
    title: "Gestão de Alunos",
    href: "/admin/alunos",
    icon: UserCog,
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Cadastro de Cursos",
    href: "/admin/cursos",
    icon: GraduationCap,
    gradient: "from-pink-500 to-pink-600",
  },
  {
    title: "Cadastro de Mentorias",
    href: "/admin/mentoria",
    icon: Shield,
    gradient: "from-teal-500 to-teal-600",
  },
  {
    title: "Cadastro de Bônus",
    href: "/admin/bonus",
    icon: Zap,
    gradient: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Gestão de Créditos",
    href: "/admin/creditos",
    icon: CreditCard,
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    title: "Notícias",
    href: "/admin/noticias",
    icon: Newspaper,
    gradient: "from-blue-500 to-blue-600",
  },
];

export const resourcesMenuItems: MenuItem[] = [
  {
    title: "Fornecedores ADM",
    href: "/admin/fornecedores",
    icon: Building2,
    gradient: "from-violet-500 to-violet-600",
  },
  {
    title: "Parceiros ADM",
    href: "/admin/parceiros",
    icon: Handshake,
    gradient: "from-rose-500 to-rose-600",
  },
  {
    title: "Ferramentas ADM",
    href: "/admin/ferramentas",
    icon: Wrench,
    gradient: "from-amber-500 to-amber-600",
  },
];

export const configurationMenuItems: MenuItem[] = [
  {
    title: "Categorias",
    href: "/admin/categorias",
    icon: Database,
    gradient: "from-slate-500 to-slate-600",
  },
  {
    title: "Tipos de Ferramentas",
    href: "/admin/tipos-softwares",
    icon: Cog,
    gradient: "from-gray-500 to-gray-600",
  },
  {
    title: "Tipos de Parceiros",
    href: "/admin/tipos-parceiros",
    icon: Users,
    gradient: "from-stone-500 to-stone-600",
  },
  {
    title: "Permissões",
    href: "/admin/permissoes",
    icon: Shield,
    gradient: "from-red-500 to-red-600",
  },
  {
    title: "Auditoria",
    href: "/admin/auditoria",
    icon: ClipboardCheck,
    gradient: "from-orange-500 to-orange-600",
  },
  {
    title: "Config. Calendly",
    href: "/admin/calendly-config",
    icon: Calendar,
    gradient: "from-blue-500 to-blue-600",
  },
];

export const systemMenuItems: MenuItem[] = [
  {
    title: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
    gradient: "from-slate-500 to-slate-600",
  },
];

export const menuGroups: MenuGroup[] = [
  { title: "Principal", items: mainMenuItems },
  { title: "Mentorias", items: mentoringMenuItems },
  { title: "Gestão", items: managementMenuItems },
  { title: "Recursos Gerais", items: resourcesMenuItems },
  { title: "Configurações", items: configurationMenuItems },
  { title: "Sistema", items: systemMenuItems },
];
