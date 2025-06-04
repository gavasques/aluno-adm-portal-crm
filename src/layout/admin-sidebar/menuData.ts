
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
  Newspaper,
  Activity
} from "lucide-react";
import { MenuItem, MenuGroup } from "./types";

export const mainMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    title: "Gestão de Usuários",
    href: "/admin/usuarios",
    icon: Users,
    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  },
  {
    title: "CRM",
    href: "/admin/crm",
    icon: BarChart,
    gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
  },
  {
    title: "Logs Webhook CRM",
    href: "/admin/crm-webhook-logs",
    icon: Activity,
    gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
  },
  {
    title: "Lista de Tarefas",
    href: "/admin/tarefas",
    icon: Calendar,
    gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
  },
];

export const mentoringMenuItems: MenuItem[] = [
  {
    title: "Dashboard de Mentorias",
    href: "/admin/mentorias",
    icon: GraduationCap,
    gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
  },
  {
    title: "Catálogo de Mentorias",
    href: "/admin/mentorias/catalogo",
    icon: BookOpenCheck,
    gradient: "bg-gradient-to-br from-cyan-500 to-cyan-600",
  },
  {
    title: "Inscrições Individuais",
    href: "/admin/inscricoes-individuais",
    icon: UserCheck,
    gradient: "bg-gradient-to-br from-green-500 to-green-600",
  },
  {
    title: "Inscrições em Grupo",
    href: "/admin/inscricoes-grupo",
    icon: UsersIcon,
    gradient: "bg-gradient-to-br from-teal-500 to-teal-600",
  },
  {
    title: "Sessões Individuais",
    href: "/admin/sessoes-individuais",
    icon: CalendarDays,
    gradient: "bg-gradient-to-br from-violet-500 to-violet-600",
  },
  {
    title: "Sessões em Grupo",
    href: "/admin/sessoes-grupo",
    icon: Users2,
    gradient: "bg-gradient-to-br from-pink-500 to-pink-600",
  },
  {
    title: "Central de Materiais",
    href: "/admin/mentorias/materiais",
    icon: FolderOpen,
    gradient: "bg-gradient-to-br from-amber-500 to-amber-600",
  },
];

export const managementMenuItems: MenuItem[] = [
  {
    title: "Gestão de Alunos",
    href: "/admin/alunos",
    icon: UserCog,
    gradient: "bg-gradient-to-br from-blue-600 to-blue-700",
  },
  {
    title: "Cadastro de Cursos",
    href: "/admin/cursos",
    icon: GraduationCap,
    gradient: "bg-gradient-to-br from-red-500 to-red-600",
  },
  {
    title: "Cadastro de Mentorias",
    href: "/admin/mentoria",
    icon: Shield,
    gradient: "bg-gradient-to-br from-slate-600 to-slate-700",
  },
  {
    title: "Cadastro de Bônus",
    href: "/admin/bonus",
    icon: Zap,
    gradient: "bg-gradient-to-br from-yellow-500 to-yellow-600",
  },
  {
    title: "Gestão de Créditos",
    href: "/admin/creditos",
    icon: CreditCard,
    gradient: "bg-gradient-to-br from-lime-500 to-lime-600",
  },
  {
    title: "Notícias",
    href: "/admin/noticias",
    icon: Newspaper,
    gradient: "bg-gradient-to-br from-sky-500 to-sky-600",
  },
];

export const resourcesMenuItems: MenuItem[] = [
  {
    title: "Fornecedores ADM",
    href: "/admin/fornecedores",
    icon: Building2,
    gradient: "bg-gradient-to-br from-gray-600 to-gray-700",
  },
  {
    title: "Parceiros ADM",
    href: "/admin/parceiros",
    icon: Handshake,
    gradient: "bg-gradient-to-br from-rose-500 to-rose-600",
  },
  {
    title: "Ferramentas ADM",
    href: "/admin/ferramentas",
    icon: Wrench,
    gradient: "bg-gradient-to-br from-orange-600 to-orange-700",
  },
];

export const configurationMenuItems: MenuItem[] = [
  {
    title: "Categorias",
    href: "/admin/categorias",
    icon: Database,
    gradient: "bg-gradient-to-br from-neutral-500 to-neutral-600",
  },
  {
    title: "Tipos de Ferramentas",
    href: "/admin/tipos-softwares",
    icon: Cog,
    gradient: "bg-gradient-to-br from-stone-500 to-stone-600",
  },
  {
    title: "Tipos de Parceiros",
    href: "/admin/tipos-parceiros",
    icon: Users,
    gradient: "bg-gradient-to-br from-zinc-500 to-zinc-600",
  },
  {
    title: "Permissões",
    href: "/admin/permissoes",
    icon: Shield,
    gradient: "bg-gradient-to-br from-red-600 to-red-700",
  },
  {
    title: "Auditoria",
    href: "/admin/auditoria",
    icon: ClipboardCheck,
    gradient: "bg-gradient-to-br from-amber-600 to-amber-700",
  },
  {
    title: "Config. Calendly",
    href: "/admin/calendly-config",
    icon: Calendar,
    gradient: "bg-gradient-to-br from-indigo-600 to-indigo-700",
  },
];

export const systemMenuItems: MenuItem[] = [
  {
    title: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
    gradient: "bg-gradient-to-br from-gray-500 to-gray-600",
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
