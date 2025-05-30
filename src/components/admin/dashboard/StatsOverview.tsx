
import React from "react";
import { motion } from "framer-motion";
import { CardStats } from "@/components/ui/card-stats";
import { 
  Users, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  CreditCard
} from "lucide-react";

export function StatsOverview() {
  const stats = [
    {
      title: "Total de Usuários",
      value: "1,247",
      icon: <Users className="h-3 w-3" />,
      description: "último mês",
      trend: "up" as const,
      trendValue: "+12%"
    },
    {
      title: "Fornecedores Ativos",
      value: "89",
      icon: <Building2 className="h-3 w-3" />,
      description: "verificados",
      trend: "up" as const,
      trendValue: "+5%"
    },
    {
      title: "Mentorias Ativas",
      value: "156",
      icon: <GraduationCap className="h-3 w-3" />,
      description: "em andamento",
      trend: "up" as const,
      trendValue: "+8%"
    },
    {
      title: "Receita Mensal",
      value: "R$ 24.350",
      icon: <TrendingUp className="h-3 w-3" />,
      description: "crescimento",
      trend: "up" as const,
      trendValue: "+18%"
    },
    {
      title: "Tarefas Concluídas",
      value: "342",
      icon: <CheckCircle className="h-3 w-3" />,
      description: "este mês",
      trend: "up" as const,
      trendValue: "+25%"
    },
    {
      title: "Sessões Pendentes",
      value: "23",
      icon: <Clock className="h-3 w-3" />,
      description: "para agendar",
      trend: "down" as const,
      trendValue: "-3%"
    },
    {
      title: "Tickets Abertos",
      value: "7",
      icon: <AlertCircle className="h-3 w-3" />,
      description: "suporte",
      trend: "down" as const,
      trendValue: "-15%"
    },
    {
      title: "Créditos Vendidos",
      value: "4,892",
      icon: <CreditCard className="h-3 w-3" />,
      description: "este mês",
      trend: "up" as const,
      trendValue: "+22%"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <CardStats
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            trend={stat.trend}
            trendValue={stat.trendValue}
            className="h-20"
          />
        </motion.div>
      ))}
    </div>
  );
}
