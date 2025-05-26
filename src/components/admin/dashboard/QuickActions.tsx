
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  UserPlus, 
  Calendar, 
  FileText, 
  Settings, 
  Users,
  Building,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    title: "Adicionar Usuário",
    description: "Criar novo usuário no sistema",
    icon: UserPlus,
    color: "blue",
    route: "/admin/usuarios",
    priority: "high"
  },
  {
    title: "Nova Mentoria",
    description: "Agendar sessão de mentoria",
    icon: Calendar,
    color: "green",
    route: "/admin/mentorias",
    priority: "medium"
  },
  {
    title: "Cadastrar Fornecedor",
    description: "Adicionar novo fornecedor",
    icon: Building,
    color: "purple",
    route: "/admin/fornecedores",
    priority: "medium"
  },
  {
    title: "Gerar Relatório",
    description: "Criar relatório de atividades",
    icon: FileText,
    color: "amber",
    route: "/admin/auditoria",
    priority: "low"
  },
  {
    title: "Gerenciar Permissões",
    description: "Configurar grupos de acesso",
    icon: Settings,
    color: "red",
    route: "/admin/permissoes",
    priority: "high"
  },
  {
    title: "CRM / Leads",
    description: "Gerenciar pipeline de vendas",
    icon: Users,
    color: "emerald",
    route: "/admin/crm",
    priority: "high"
  }
];

const colorMap = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600", 
  purple: "from-purple-500 to-purple-600",
  amber: "from-amber-500 to-amber-600",
  red: "from-red-500 to-red-600",
  emerald: "from-emerald-500 to-emerald-600"
};

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200"
};

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(action.route)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${colorMap[action.color as keyof typeof colorMap]} text-white group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{action.title}</h4>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${priorityColors[action.priority as keyof typeof priorityColors]}`}
                >
                  {action.priority}
                </Badge>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
