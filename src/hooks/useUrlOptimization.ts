
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Mapeamento de URLs antigas para novas
const URL_REDIRECTS: Record<string, string> = {
  // URLs administrativas
  "/admin/settings": "/admin/configuracoes",
  "/admin/users": "/admin/usuarios", 
  "/admin/permissions": "/admin/permissoes",
  "/admin/gestao-alunos": "/admin/alunos",
  "/admin/tasks": "/admin/tarefas",
  "/admin/crm": "/admin/leads",
  "/admin/registers": "/admin/cadastros",
  "/admin/partners": "/admin/parceiros",
  "/admin/tools": "/admin/ferramentas",
  "/admin/suppliers": "/admin/fornecedores",
  
  // URLs do aluno
  "/student": "/aluno",
  "/student/settings": "/aluno/configuracoes",
  "/student/my-suppliers": "/aluno/meus-fornecedores",
  "/student/partners": "/aluno/parceiros",
  "/student/suppliers": "/aluno/fornecedores",
  "/student/tools": "/aluno/ferramentas",
  
  // URLs públicas
  "/reset-password": "/redefinir-senha",
  "/confirm-email": "/confirmar-email",
  "/accept-invite": "/aceitar-convite"
};

export const useUrlOptimization = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const redirectTo = URL_REDIRECTS[currentPath];
    
    if (redirectTo) {
      // Preservar query params e hash se existirem
      const search = location.search;
      const hash = location.hash;
      const newUrl = `${redirectTo}${search}${hash}`;
      
      console.log(`Redirecionando de ${currentPath} para ${newUrl}`);
      navigate(newUrl, { replace: true });
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  // Função para obter URL canônica
  const getCanonicalUrl = (path?: string) => {
    const currentPath = path || location.pathname;
    const baseUrl = window.location.origin;
    return `${baseUrl}${currentPath}`;
  };

  // Função para gerar breadcrumbs baseados na URL
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    let currentPath = '';
    
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      
      let label = segment;
      
      // Traduzir segmentos comuns
      const translations: Record<string, string> = {
        'admin': 'Administração',
        'aluno': 'Área do Aluno',
        'configuracoes': 'Configurações',
        'usuarios': 'Usuários',
        'permissoes': 'Permissões',
        'alunos': 'Alunos',
        'tarefas': 'Tarefas',
        'leads': 'Leads',
        'cadastros': 'Cadastros',
        'parceiros': 'Parceiros',
        'ferramentas': 'Ferramentas',
        'fornecedores': 'Fornecedores',
        'meus-fornecedores': 'Meus Fornecedores'
      };
      
      label = translations[segment] || segment;
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: currentPath === location.pathname
      });
    }
    
    return breadcrumbs;
  };

  return {
    getCanonicalUrl,
    generateBreadcrumbs,
    isOptimizedUrl: !URL_REDIRECTS[location.pathname]
  };
};
