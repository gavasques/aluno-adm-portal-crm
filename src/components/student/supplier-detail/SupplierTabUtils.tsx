
import { FileText, Tag, Building, MessageSquare, Calendar, Star } from "lucide-react";
import React from "react";

// Get tab gradient based on tab
export const getTabGradient = (tab: string) => {
  switch (tab) {
    case "dados":
      return "from-violet-50 to-indigo-50 border-violet-200";
    case "marcas":
      return "from-blue-50 to-sky-50 border-blue-200";
    case "filiais":
      return "from-emerald-50 to-teal-50 border-emerald-200";
    case "contatos":
      return "from-amber-50 to-yellow-50 border-amber-200";
    case "comunicacao":
      return "from-rose-50 to-pink-50 border-rose-200";
    case "arquivos":
      return "from-gray-50 to-slate-50 border-gray-200";
    case "avaliacoes":
      return "from-purple-50 to-fuchsia-50 border-purple-200";
    case "comentarios":
      return "from-cyan-50 to-blue-50 border-cyan-200";
    default:
      return "from-purple-50 to-blue-50 border-purple-100";
  }
};

// Get header gradient based on tab
export const getHeaderGradient = (tab: string) => {
  switch (tab) {
    case "dados":
      return "from-violet-500 to-indigo-500 border-violet-300";
    case "marcas":
      return "from-blue-500 to-sky-500 border-blue-300";
    case "filiais":
      return "from-emerald-500 to-teal-500 border-emerald-300";
    case "contatos":
      return "from-amber-500 to-yellow-500 border-amber-300";
    case "comunicacao":
      return "from-rose-500 to-pink-500 border-rose-300";
    case "arquivos":
      return "from-gray-600 to-slate-500 border-gray-400";
    case "avaliacoes":
      return "from-purple-500 to-fuchsia-500 border-purple-300";
    case "comentarios":
      return "from-cyan-500 to-blue-500 border-cyan-300";
    default:
      return "from-purple-500 to-blue-500 border-purple-300";
  }
};

// Get icon for tab
export const getTabIcon = (tab: string): React.ReactNode => {
  switch (tab) {
    case "dados":
      return <FileText className="mr-2 h-4 w-4" />;
    case "marcas":
      return <Tag className="mr-2 h-4 w-4" />;
    case "filiais":
      return <Building className="mr-2 h-4 w-4" />;
    case "contatos":
      return <MessageSquare className="mr-2 h-4 w-4" />;
    case "comunicacao":
      return <Calendar className="mr-2 h-4 w-4" />;
    case "arquivos":
      return <FileText className="mr-2 h-4 w-4" />;
    case "avaliacoes":
      return <Star className="mr-2 h-4 w-4" />;
    case "comentarios":
      return <MessageSquare className="mr-2 h-4 w-4" />;
    default:
      return null;
  }
};

export const tabsData = [
  { id: "dados", label: "Dados" },
  { id: "marcas", label: "Marcas" },
  { id: "filiais", label: "Filiais" },
  { id: "contatos", label: "Contatos" },
  { id: "comunicacao", label: "Comunicação" },
  { id: "arquivos", label: "Arquivos" },
  { id: "avaliacoes", label: "Avaliações" },
  { id: "comentarios", label: "Comentários" }
];

// Helper formatters
export const formatCNPJ = (value: string) => {
  const cnpjClean = value.replace(/\D/g, '');
  let formattedCNPJ = cnpjClean;
  
  if (cnpjClean.length > 2) formattedCNPJ = cnpjClean.substring(0, 2) + '.' + cnpjClean.substring(2);
  if (cnpjClean.length > 5) formattedCNPJ = formattedCNPJ.substring(0, 6) + '.' + cnpjClean.substring(5);
  if (cnpjClean.length > 8) formattedCNPJ = formattedCNPJ.substring(0, 10) + '/' + cnpjClean.substring(8);
  if (cnpjClean.length > 12) formattedCNPJ = formattedCNPJ.substring(0, 15) + '-' + cnpjClean.substring(12, 14);
  
  return formattedCNPJ;
};

export const formatCEP = (value: string) => {
  const cepClean = value.replace(/\D/g, '');
  if (cepClean.length > 5) {
    return cepClean.substring(0, 5) + '-' + cepClean.substring(5, 8);
  }
  return cepClean;
};

// Motion variants
export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

// Constants
export const ESTADOS_BRASILEIROS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
  "Outro Local"
];

export const CATEGORIAS = [
  "Produtos Regionais",
  "Tecnologia",
  "Vestuário",
  "Alimentos",
  "Bebidas",
  "Eletrônicos",
  "Sustentáveis", 
  "Decoração",
  "Produtos Diversos"
];
