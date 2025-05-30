
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Book, 
  UserCheck, 
  Building, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const statsData = [
  {
    title: "Usuários Totais",
    value: "125",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "blue",
    description: "último mês",
    route: "/admin/usuarios"
  },
  {
    title: "Alunos Ativos",
    value: "98",
    change: "+8%",
    trend: "up",
    icon: UserCheck,
    color: "green",
    description: "neste período",
    route: "/admin/alunos"
  },
  {
    title: "Fornecedores",
    value: "47",
    change: "+3",
    trend: "up",
    icon: Building,
    color: "purple",
    description: "cadastrados",
    route: "/admin/fornecedores"
  },
  {
    title: "Mentorias",
    value: "26",
    change: "-2",
    trend: "down",
    icon: Book,
    color: "amber",
    description: "agendadas",
    route: "/admin/mentorias"
  },
  {
    title: "Tarefas",
    value: "15",
    change: "+5",
    trend: "up",
    icon: Calendar,
    color: "red",
    description: "pendentes",
    route: "/admin/tarefas"
  },
  {
    title: "Receita",
    value: "R$ 12.5k",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "emerald",
    description: "este mês",
    route: "/admin/crm"
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

export function StatsOverview() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -2 }}
          className="cursor-pointer"
          onClick={() => navigate(stat.route)}
        >
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className={`h-1 bg-gradient-to-r ${colorMap[stat.color as keyof typeof colorMap]}`} />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${colorMap[stat.color as keyof typeof colorMap]} text-white group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${stat.trend === "up" ? "text-green-600 border-green-200" : "text-red-600 border-red-200"}`}
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
