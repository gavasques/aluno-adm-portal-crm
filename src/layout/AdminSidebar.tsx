
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Briefcase, 
  ClipboardCheck, 
  ListTodo, 
  BarChart3, 
  Settings,
  Truck,
  Handshake,
  Wrench,
  GraduationCap,
  Calendar,
  FolderOpen,
  UserCheck,
  Users as UsersIcon,
  BookOpenCheck
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    group: "Geral"
  },
  {
    title: "Usuários",
    url: "/admin/usuarios",
    icon: Users,
    group: "Gestão"
  },
  {
    title: "Permissões",
    url: "/admin/permissoes",
    icon: Shield,
    group: "Gestão"
  },
  {
    title: "Cadastros",
    url: "/admin/cadastros",
    icon: Briefcase,
    group: "Gestão"
  },
  {
    title: "Auditoria",
    url: "/admin/auditoria",
    icon: ClipboardCheck,
    group: "Gestão"
  },
  {
    title: "Tarefas",
    url: "/admin/tarefas",
    icon: ListTodo,
    group: "Operacional"
  },
  {
    title: "CRM",
    url: "/admin/crm",
    icon: BarChart3,
    group: "Operacional"
  },
  {
    title: "Fornecedores",
    url: "/admin/fornecedores",
    icon: Truck,
    group: "Geral ADM"
  },
  {
    title: "Parceiros",
    url: "/admin/parceiros",
    icon: Handshake,
    group: "Geral ADM"
  },
  {
    title: "Ferramentas",
    url: "/admin/ferramentas",
    icon: Wrench,
    group: "Geral ADM"
  },
  {
    title: "Dashboard Mentorias",
    url: "/admin/mentorias",
    icon: GraduationCap,
    group: "Mentorias"
  },
  {
    title: "Catálogo",
    url: "/admin/mentorias/catalogo",
    icon: BookOpenCheck,
    group: "Mentorias"
  },
  {
    title: "Inscrições Individuais",
    url: "/admin/inscricoes-individuais",
    icon: UserCheck,
    group: "Mentorias"
  },
  {
    title: "Inscrições em Grupo",
    url: "/admin/inscricoes-grupo",
    icon: UsersIcon,
    group: "Mentorias"
  },
  {
    title: "Sessões Individuais",
    url: "/admin/mentorias/sessoes-individuais",
    icon: Calendar,
    group: "Mentorias"
  },
  {
    title: "Sessões em Grupo",
    url: "/admin/mentorias/sessoes-grupo",
    icon: UsersIcon,
    group: "Mentorias"
  },
  {
    title: "Materiais",
    url: "/admin/mentorias/materiais",
    icon: FolderOpen,
    group: "Mentorias"
  },
  {
    title: "Config. Calendly",
    url: "/admin/calendly-config",
    icon: Calendar,
    group: "Mentorias"
  },
  {
    title: "Configurações",
    url: "/admin/configuracoes",
    icon: Settings,
    group: "Sistema"
  }
];

const groupedItems = sidebarItems.reduce((groups, item) => {
  const group = item.group;
  if (!groups[group]) {
    groups[group] = [];
  }
  groups[group].push(item);
  return groups;
}, {} as Record<string, typeof sidebarItems>);

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white overflow-y-auto">
      <div className="p-4">
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <div key={groupName} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {groupName}
            </h3>
            <nav className="space-y-1">
              {items.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.url
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
}
