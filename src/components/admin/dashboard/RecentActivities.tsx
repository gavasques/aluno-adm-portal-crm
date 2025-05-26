
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  User, 
  UserPlus, 
  Calendar, 
  Building, 
  FileText,
  ArrowRight,
  Activity
} from "lucide-react";

const recentActivities = [
  {
    id: 1,
    type: "user_created",
    title: "Novo usuário cadastrado",
    description: "Ana Silva foi adicionada ao sistema",
    time: "2 min atrás",
    icon: UserPlus,
    color: "green",
    user: "Admin"
  },
  {
    id: 2,
    type: "mentoring_scheduled",
    title: "Mentoria agendada",
    description: "Sessão individual marcada para amanhã às 14h",
    time: "15 min atrás", 
    icon: Calendar,
    color: "blue",
    user: "Carlos Oliveira"
  },
  {
    id: 3,
    type: "supplier_added",
    title: "Fornecedor cadastrado",
    description: "TechSolutions adicionado ao catálogo",
    time: "1 hora atrás",
    icon: Building,
    color: "purple",
    user: "Admin"
  },
  {
    id: 4,
    type: "report_generated",
    title: "Relatório gerado",
    description: "Relatório mensal de atividades criado",
    time: "2 horas atrás",
    icon: FileText,
    color: "amber",
    user: "Sistema"
  },
  {
    id: 5,
    type: "user_login",
    title: "Login de usuário",
    description: "Maria Santos acessou o sistema",
    time: "3 horas atrás",
    icon: User,
    color: "gray",
    user: "Maria Santos"
  }
];

const colorMap = {
  green: "text-green-600 bg-green-100",
  blue: "text-blue-600 bg-blue-100",
  purple: "text-purple-600 bg-purple-100",
  amber: "text-amber-600 bg-amber-100",
  gray: "text-gray-600 bg-gray-100"
};

export function RecentActivities() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Atividades Recentes
          </CardTitle>
          <Button variant="outline" size="sm">
            Ver Todas
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className={`p-2 rounded-lg ${colorMap[activity.color as keyof typeof colorMap]} group-hover:scale-110 transition-transform`}>
                <activity.icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {activity.user}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {recentActivities.length === 0 && (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Nenhuma atividade recente
            </h3>
            <p className="text-gray-500">
              As atividades do sistema aparecerão aqui.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
