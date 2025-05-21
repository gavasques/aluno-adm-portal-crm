
import { PermissionGroup, StudentMenuItem } from "@/types/permission.types";

// Student menu items that can be assigned to permission groups
export const studentMenuItems: StudentMenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/student",
    description: "Página inicial do painel do aluno"
  },
  {
    id: "suppliers",
    name: "Fornecedores",
    path: "/student/suppliers",
    description: "Lista geral de fornecedores"
  },
  {
    id: "partners",
    name: "Parceiros",
    path: "/student/partners",
    description: "Lista de parceiros disponíveis"
  },
  {
    id: "tools",
    name: "Ferramentas",
    path: "/student/tools",
    description: "Lista de ferramentas disponíveis"
  },
  {
    id: "my-suppliers",
    name: "Meus Fornecedores",
    path: "/student/my-suppliers",
    description: "Fornecedores cadastrados pelo aluno"
  },
  {
    id: "settings",
    name: "Configurações",
    path: "/student/settings",
    description: "Configurações da conta do aluno"
  }
];

// Mock data for permission groups
export const initialPermissionGroups: PermissionGroup[] = [
  {
    id: 1,
    name: "Acesso Completo",
    description: "Acesso a todas as áreas do painel do aluno",
    createdAt: "2023-05-20T10:00:00Z",
    updatedAt: "2023-05-20T10:00:00Z",
    allowedMenus: studentMenuItems.map(item => item.id)
  },
  {
    id: 2,
    name: "Acesso Básico",
    description: "Acesso apenas ao Dashboard e Configurações",
    createdAt: "2023-05-20T11:30:00Z",
    updatedAt: "2023-05-21T09:15:00Z",
    allowedMenus: ["dashboard", "settings"]
  }
];
